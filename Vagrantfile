Vagrant.configure("2") do |config|
  # via https://stefanwrobel.com/how-to-make-vagrant-performance-not-suck
  config.vm.provider :virtualbox do |v|

    host = RbConfig::CONFIG['host_os']

    # Give VM 1/4 system memory 
    if host =~ /darwin/
      # sysctl returns Bytes and we need to convert to MB
      mem = `sysctl -n hw.memsize`.to_i / 1024
    elsif host =~ /linux/
      # meminfo shows KB and we need to convert to MB
      mem = `grep 'MemTotal' /proc/meminfo | sed -e 's/MemTotal://' -e 's/ kB//'`.to_i 
    elsif host =~ /mswin|mingw|cygwin/
      # Windows code via https://github.com/rdsubhas/vagrant-faster
      mem = `wmic computersystem Get TotalPhysicalMemory`.split[1].to_i / 1024
    end

    mem = mem / 1024 / 4
    v.customize ["modifyvm", :id, "--memory", mem]

    # don't customize virtual cpus as this actually decreases performance!!!

  end

  # Base Image: Latest CentOS 7.x x86_64 -- https://atlas.hashicorp.com/centos/boxes/7
  config.vm.box = "centos/7"

  # Use Vagrant's default insecure key (~/.vagrant.d/insecure_private_key)
  config.ssh.insert_key = false

  # Setup the ip-addresses and port bindings
  config.vm.network :private_network, ip: "10.0.0.30"

  # Map project directory using NFS (http://docs-v1.vagrantup.com/v1/docs/nfs.html)
  # Speedup nfs watching: https://www.jverdeyen.be/vagrant/speedup-vagrant-nfs/ (however we don't use fsc as it required an extra dependency)
  # https://blog.inovex.de/doh-my-vagrant-nfs-is-slow/
  # Does not support Windows!
  config.vm.synced_folder ".", "/vagrant", type: "nfs", nfs_udp: false, nfs_version: 3

  # Map aaa-backend-stack base project into server for debugging issues with our upstream internal project
  # This is disabled by default
  #
  # config.vm.synced_folder "../aaa-backend-stack", "/aaa-backend-stack", type: "nfs", nfs_udp: false, nfs_version: 3
  #
  # vagrant$ yarn global add lerna@<CURRENT aaa-backend-stack lerna version> inside your project vagrant env 
  # vagrant$ yarn link-all in /aaa-backend-stack inside your project vagrant env to link your local aaa-backend-stack@master
  # vagrant$ yarn link @aaa-backend-stack/<PKG> in /vagrant inside your project vagrant env to replace your deps by the linked ones afterwards

  # Provision with Ansible
  config.vm.provision "ansible" do |ansible|
      ansible.groups = { "appserver" => ["default"], "vm:children" => ["appserver"] }
      ansible.playbook = "ansible/provision.yaml"
  end
end
