{ pkgs ? import <nixpkgs> {} }:
with pkgs;
stdenv.mkDerivation {
  name = "comick-js";

  buildInputs = with pkgs; [
    nodejs-16_x
  ] ++ (with pkgs.nodePackages; [
    npm
  ]);

  shellHook = ''
    [[ ! -d "$(pwd)/node_modules" ]] && npm install
    PATH="$PATH:$(pwd)/node_modules/.bin/"
  '';
}
