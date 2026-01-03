# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  # Use Ubuntu 22.04 LTS as base box
  config.vm.box = "ubuntu/jammy64"
  config.vm.hostname = "casino-vm"

  # Network configuration
  # Forward ports for all services
  config.vm.network "forwarded_port", guest: 80, host: 8000, host_ip: "127.0.0.1"      # Frontend (Nginx)
  config.vm.network "forwarded_port", guest: 8080, host: 8080, host_ip: "127.0.0.1"   # phpMyAdmin
  config.vm.network "forwarded_port", guest: 3306, host: 3306, host_ip: "127.0.0.1"   # MySQL
  config.vm.network "forwarded_port", guest: 6379, host: 6379, host_ip: "127.0.0.1"   # Redis

  # Private network for easier access
  config.vm.network "private_network", ip: "192.168.56.10"

  # Sync project folder to VM
  config.vm.synced_folder ".", "/home/vagrant/casino", type: "virtualbox"

  # VM Provider configuration
  config.vm.provider "virtualbox" do |vb|
    vb.name = "casino-vm"
    vb.memory = "4096"
    vb.cpus = 2

    # Performance optimizations
    vb.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
    vb.customize ["modifyvm", :id, "--natdnsproxy1", "on"]
    vb.customize ["modifyvm", :id, "--ioapic", "on"]
  end

  # Provisioning script to install Docker and Docker Compose
  config.vm.provision "shell", inline: <<-SHELL
    set -e

    echo "=========================================="
    echo "Updating system packages..."
    echo "=========================================="
    apt-get update
    apt-get upgrade -y

    echo "=========================================="
    echo "Installing required dependencies..."
    echo "=========================================="
    apt-get install -y \
      apt-transport-https \
      ca-certificates \
      curl \
      gnupg \
      lsb-release \
      software-properties-common

    echo "=========================================="
    echo "Installing Docker..."
    echo "=========================================="
    # Add Docker's official GPG key
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
    chmod a+r /etc/apt/keyrings/docker.asc

    # Add Docker repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      tee /etc/apt/sources.list.d/docker.list > /dev/null

    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    echo "=========================================="
    echo "Configuring Docker..."
    echo "=========================================="
    # Add vagrant user to docker group
    usermod -aG docker vagrant

    # Enable and start Docker service
    systemctl enable docker
    systemctl start docker

    echo "=========================================="
    echo "Installing Docker Compose standalone..."
    echo "=========================================="
    curl -SL https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64 -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose

    echo "=========================================="
    echo "Verifying installations..."
    echo "=========================================="
    docker --version
    docker compose version
    docker-compose --version

    echo "=========================================="
    echo "Provisioning complete!"
    echo "=========================================="
    echo ""
    echo "To start the casino application:"
    echo "  1. vagrant ssh"
    echo "  2. cd /home/vagrant/casino"
    echo "  3. docker-compose up --build -d"
    echo ""
    echo "Access the application at:"
    echo "  - Frontend: http://localhost:8000 or http://192.168.56.10"
    echo "  - phpMyAdmin: http://localhost:8080 or http://192.168.56.10:8080"
    echo ""
  SHELL

  # Optional: Run docker-compose on every vagrant up
  config.vm.provision "shell", run: "always", inline: <<-SHELL
    echo "=========================================="
    echo "Starting Casino Application..."
    echo "=========================================="
    cd /home/vagrant/casino

    # Check if containers are already running
    if docker compose ps --quiet 2>/dev/null | grep -q .; then
      echo "Containers already running. Use 'docker-compose restart' to restart."
    else
      echo "Starting containers in background..."
      docker compose up --build -d
      echo ""
      echo "Containers starting... Use 'docker compose logs -f' to view logs."
    fi

    echo ""
    echo "=========================================="
    echo "Casino VM is ready!"
    echo "=========================================="
    echo ""
    echo "Access points:"
    echo "  - Frontend:    http://localhost:8000"
    echo "  - Frontend:    http://192.168.56.10"
    echo "  - phpMyAdmin:  http://localhost:8080"
    echo "  - phpMyAdmin:  http://192.168.56.10:8080"
    echo ""
    echo "SSH into VM:     vagrant ssh"
    echo "View logs:       docker compose logs -f"
    echo "Stop services:   docker compose down"
    echo ""
  SHELL
end
