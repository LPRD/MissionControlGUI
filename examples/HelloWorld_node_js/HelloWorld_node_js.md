Enviornment Setup Instructions
Go to https://github.com/nvm-sh/nvm for the latest 
Node Version Manager (NVM) installation instructions 
Install the latest version of nvm:
sudo curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

Install the latest version of nodejs:
nvm install node
(DO NOT USE apt install nodejs!!!)
("node" is an alias for the latest version)
A specific version can be installed as follows:
nvm install 20.0.0
(or 16.3.0, 12.22.1, etc. Use ls-remote to see available versions)
Verify node works by running
node --version

###############################################
If the following error occurs:
node: /lib/arm-linux-gnueabihf/libstdc++.so.6: version `GLIBCXX_3.4.26' not found (required by node)
The following file: (on Raspbian)
/usr/lib/arm-linux-gnueabihf/libstdc++.so.6
is missing GLIBCXX_3.4.26
You can verify using the following command:
strings /usr/lib/arm-linux-gnueabihf/libstdc++.so.6 | grep -i glib

To resolve the error, install gcc-9 or later:
Try updating the system to Raspbian 11 (bullseye)
This version uses GCC 10.2 by default
buster with bullseye in your /etc/apt/sources.list file and run:
apt-get update
apt-get upgrade
apt-get dist-upgrade
###############################################

A recent version of npm (9.6.4) is included with node 20.0.0
The latest version can be installed with:
npm install latest-version

Steps to run the test script
1. Navigate to the HelloWorld_node_js folder
2. Run the following command:
node index.js
'Hello World' should appear in the command line
