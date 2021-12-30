{
  description = "Automatically update";

  inputs = {
    naersk.url = "github:nmattia/naersk";
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    utils.url = "github:numtide/flake-utils";
    gitignore = {
      url = "github:hercules-ci/gitignore";
      flake = false;
    };
    flake-compat = {
      url = "github:edolstra/flake-compat";
      flake = false;
    };
  };

  outputs = { self, nixpkgs, rust-overlay, utils, naersk, gitignore, ... }:
    let
      name = "ac3c";
      version = "0.1.0";
      rustChannel = "stable";
    in
    utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs {
          inherit system;
          overlays = [
            rust-overlay.overlay
            (self: super: {
              rustc = self.rust-bin.${rustChannel}.latest.default;
              cargo = self.rust-bin.${rustChannel}.latest.default;
            })
          ];
        };

        inherit (import gitignore { inherit (pkgs) lib; }) gitignoreSource;

        naersk-lib = naersk.lib."${system}".override {
          rustc = pkgs.rustc;
          cargo = pkgs.cargo;
        };

        buildInputs = with pkgs; [ openssl.dev ];
        nativeBuildInputs = with pkgs; [ rustc cargo pkgconfig ];
      in
      with pkgs;
      rec {
        packages.${name} = naersk-lib.buildPackage {
          pname = name;
          version = version;
          root = gitignoreSource ./.;
          inherit nativeBuildInputs;
        };

        defaultPackage = packages.${name};

        apps.${name} = utils.lib.mkApp {
          drv = packages.${name};
        };

        apps.check = {
          type = "app";
          program = "${pkgs.cargo-watch}/bin/cargo-watch";
        };

        devShell = mkShell {
          buildInputs = nativeBuildInputs ++ [
            rust
            rust-analyzer
            cargo-watch
          ];

          RUST_SRC_PATH = "${pkgs.rust-bin.${rustChannel}.latest.rust-src}/lib/rustlib/src/rust/library";
          RUST_LOG = "info";
          RUST_BACKTRACE = 1;
        };
      }
    );
}
