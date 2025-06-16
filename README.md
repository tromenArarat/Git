## PASOS actualizar repositorios desde ssh

### Step 1: Set Up SSH Access for GitHub

a-Generate an SSH Key (if not done already):
	
	ssh-keygen -t ed25519 -C "your_email@example.com"

b-Add the SSH Key to the SSH Agent:
	
	eval "$(ssh-agent -s)"
	ssh-add ~/.ssh/id_ed25519

c-Add the SSH Key to Your GitHub Account:
	

1-Copy the public key to your clipboard:
	
	cat ~/.ssh/id_ed25519.pub

2-Go to GitHub > Settings > SSH and GPG keys > New SSH key, and paste the key.

d- Verify SSH Connection to GitHub:

	ssh -T git@github.com

	You should see a message like:
	Hi username! You've successfully authenticated, but GitHub does not provide shell access.


### Step 2: Clone the Repository Locally (if not already done)

a-Use SSH to clone the repository if you haven't yet:
	
	git clone git@github.com:username/repository.git
	cd repository


### Step 3: Copy Your Local Files to the Repository

a-Copy the files you want to update into the local repository directory:
cp -r /path/to/local/files/* /path/to/repository/

b- Check the repository's status to confirm the added/updated files:
git status


Step 4: Commit and Push the Changes
git add .
git commit -m "Updated files with new content"
git push origin main
