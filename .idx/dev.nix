{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # or "unstable"
  # Use https://search.nixos.org/packages to find packages
  packages = [
    pkgs.nodejs_20
  ];
  # Sets environment variables in the workspace
  env = {};
  # Fast way to run services in the workspace, in case you need a database
  services = {};
  # Docker, containers and registries
  docker = {};
  # VsCode extensions
  extensions = [];
}
