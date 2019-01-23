### Initial installation

From an ubuntu 18.04 installation:

Install git:

sudo apt install git

Install node v11.x:

curl -sL https://deb.nodesource.com/setup_11.x | sudo -E bash -
sudo apt-get install -y nodejs

Install mongoDB:

sudo apt install mongodb

Install yarn:

curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn

Clone the project:

cd ~/
git clone https://github.com/wmorrow4/group12_SmallProject.git

Build the project and install dependencies:

cd group12_SmallProject
yarn

### Building the project

gulp

### Running the project

node dist/server/index.js

Open browser and go to: http://localhost:8080


