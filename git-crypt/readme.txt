Skip to content
This repository
Search
Pull requests
Issues
Marketplace
Explore
 @glantzsimon
 Sign out
 Watch 77
  Star 2,415
 Fork 178 AGWA/git-crypt
 Code  Issues 53  Pull requests 21  Projects 0  Wiki Insights 
Transparent file encryption in git https://www.agwa.name/projects/git-cr…
 164 commits
 3 branches
 11 releases
 11 contributors
 GPL-3.0
 C++ 98.7%	 Makefile 1.3%
C++	Makefile
Clone or download  Create new file Upload files Find file Branch: master New pull request
Latest commit 788a6a9  on 4 Jun 2016  1 @nirvdrum nirvdrum committed with AGWA Make the repo state directory location configurable.  …
doc	Add documentation for multiple keys	3 years ago
man	Prepare 0.5.0 release	2 years ago
.gitattributes	Add .gitattributes file to ignore .git files when creating archive	3 years ago
.gitignore	Initial version	5 years ago
AUTHORS	Add AUTHORS file	5 years ago
CONTRIBUTING.md	Add CONTRIBUTING and THANKS files	3 years ago
COPYING	Add README and copyright notices	5 years ago
INSTALL	Makefile: refine man page rules	2 years ago
INSTALL.md	Makefile: refine man page rules	2 years ago
Makefile	Remove gnuism from Makefile	2 years ago
NEWS	Prepare 0.5.0 release	2 years ago
NEWS.md	Prepare 0.5.0 release	2 years ago
README	Prepare 0.5.0 release	2 years ago
README.md	Prepare 0.5.0 release	2 years ago
RELEASE_NOTES-0.4.1.md	Update for git-crypt 0.4.1	3 years ago
RELEASE_NOTES-0.4.md	Update README, NEWS, write release notes for 0.4	3 years ago
THANKS.md	Credit Michael Schout in THANKS file	3 years ago
commands.cpp	Make the repo state directory location configurable.	a year ago
commands.hpp	Rename add-gpg-key command, etc. to add-gpg-user, etc.	3 years ago
coprocess-unix.cpp	Add Coprocess class	2 years ago
coprocess-unix.hpp	Add Coprocess class	2 years ago
coprocess-win32.cpp	Add Coprocess class	2 years ago
coprocess-win32.hpp	Add Coprocess class	2 years ago
coprocess.cpp	Add Coprocess class	2 years ago
coprocess.hpp	Add Coprocess class	2 years ago
crypto-openssl.cpp	Ensure memsets of sensitive memory aren't optimized away	3 years ago
crypto.cpp	Ensure memsets of sensitive memory aren't optimized away	3 years ago
crypto.hpp	Simplify CTR code	3 years ago
fhstream.cpp	Add Coprocess class	2 years ago
fhstream.hpp	Add Coprocess class	2 years ago
git-crypt.cpp	Add 'git-crypt version' command	3 years ago
git-crypt.hpp	Prepare 0.5.0 release	2 years ago
gpg.cpp	Add --trusted option to gpg-add-user	3 years ago
gpg.hpp	Add --trusted option to gpg-add-user	3 years ago
key.cpp	Raise an error if legacy key file has trailing data	3 years ago
key.hpp	Avoid unsafe integer signedness conversions when loading key file	3 years ago
parse_options.cpp	Re-license parse_options under X11 license	2 years ago
parse_options.hpp	Re-license parse_options under X11 license	2 years ago
util-unix.cpp	Don't hard code path to git-crypt in .git/config on Linux	2 years ago
util-win32.cpp	Add Coprocess class	2 years ago
util.cpp	Add Coprocess class	2 years ago
util.hpp	touch_file, remove_file: ignore non-existent files	3 years ago
 README.md
git-crypt - transparent file encryption in git

git-crypt enables transparent encryption and decryption of files in a git repository. Files which you choose to protect are encrypted when committed, and decrypted when checked out. git-crypt lets you freely share a repository containing a mix of public and private content. git-crypt gracefully degrades, so developers without the secret key can still clone and commit to a repository with encrypted files. This lets you store your secret material (such as keys or passwords) in the same repository as your code, without requiring you to lock down your entire repository.

git-crypt was written by Andrew Ayer (agwa@andrewayer.name). For more information, see https://www.agwa.name/projects/git-crypt.

Building git-crypt

See the INSTALL.md file.

Using git-crypt

Configure a repository to use git-crypt:

cd repo
git-crypt init
Specify files to encrypt by creating a .gitattributes file:

secretfile filter=git-crypt diff=git-crypt
*.key filter=git-crypt diff=git-crypt
Like a .gitignore file, it can match wildcards and should be checked into the repository. See below for more information about .gitattributes. Make sure you don't accidentally encrypt the .gitattributes file itself (or other git files like .gitignore or .gitmodules). Make sure your .gitattributes rules are in place before you add sensitive files, or those files won't be encrypted!

Share the repository with others (or with yourself) using GPG:

git-crypt add-gpg-user USER_ID
USER_ID can be a key ID, a full fingerprint, an email address, or anything else that uniquely identifies a public key to GPG (see "HOW TO SPECIFY A USER ID" in the gpg man page). Note: git-crypt add-gpg-user will add and commit a GPG-encrypted key file in the .git-crypt directory of the root of your repository.

Alternatively, you can export a symmetric secret key, which you must securely convey to collaborators (GPG is not required, and no files are added to your repository):

git-crypt export-key /path/to/key
After cloning a repository with encrypted files, unlock with with GPG:

git-crypt unlock
Or with a symmetric key:

git-crypt unlock /path/to/key
That's all you need to do - after git-crypt is set up (either with git-crypt init or git-crypt unlock), you can use git normally - encryption and decryption happen transparently.

Current Status

The latest version of git-crypt is 0.5.0, released on 2015-05-30. git-crypt aims to be bug-free and reliable, meaning it shouldn't crash, malfunction, or expose your confidential data. However, it has not yet reached maturity, meaning it is not as documented, featureful, or easy-to-use as it should be. Additionally, there may be backwards-incompatible changes introduced before version 1.0.

Security

git-crypt is more secure that other transparent git encryption systems. git-crypt encrypts files using AES-256 in CTR mode with a synthetic IV derived from the SHA-1 HMAC of the file. This mode of operation is provably semantically secure under deterministic chosen-plaintext attack. That means that although the encryption is deterministic (which is required so git can distinguish when a file has and hasn't changed), it leaks no information beyond whether two files are identical or not. Other proposals for transparent git encryption use ECB or CBC with a fixed IV. These systems are not semantically secure and leak information.

Limitations

git-crypt relies on git filters, which were not designed with encryption in mind. As such, git-crypt is not the best tool for encrypting most or all of the files in a repository. Where git-crypt really shines is where most of your repository is public, but you have a few files (perhaps private keys named *.key, or a file with API credentials) which you need to encrypt. For encrypting an entire repository, consider using a system like git-remote-gcrypt instead. (Note: no endorsement is made of git-remote-gcrypt's security.)

git-crypt does not encrypt file names, commit messages, symlink targets, gitlinks, or other metadata.

git-crypt does not hide when a file does or doesn't change, the length of a file, or the fact that two files are identical (see "Security" section above).

Files encrypted with git-crypt are not compressible. Even the smallest change to an encrypted file requires git to store the entire changed file, instead of just a delta.

Although git-crypt protects individual file contents with a SHA-1 HMAC, git-crypt cannot be used securely unless the entire repository is protected against tampering (an attacker who can mutate your repository can alter your .gitattributes file to disable encryption). If necessary, use git features such as signed tags instead of relying solely on git-crypt for integrity.

Files encrypted with git-crypt cannot be patched with git-apply, unless the patch itself is encrypted. To generate an encrypted patch, use git diff --no-textconv --binary. Alternatively, you can apply a plaintext patch outside of git using the patch command.

git-crypt does not work reliably with some third-party git GUIs, such as Atlassian SourceTree and GitHub for Mac. Files might be left in an unencrypted state.

Gitattributes File

The .gitattributes file is documented in the gitattributes(5) man page. The file pattern format is the same as the one used by .gitignore, as documented in the gitignore(5) man page, with the exception that specifying merely a directory (e.g. /dir/) is not sufficient to encrypt all files beneath it.

Also note that the pattern dir/* does not match files under sub-directories of dir/. To encrypt an entire sub-tree dir/, place the following in dir/.gitattributes:

* filter=git-crypt diff=git-crypt
.gitattributes !filter !diff
The second pattern is essential for ensuring that .gitattributes itself is not encrypted.

Mailing Lists

To stay abreast of, and provide input to, git-crypt development, consider subscribing to one or both of our mailing lists:

Announcements
Discussion
© 2017 GitHub, Inc.
Terms
Privacy
Security
Status
Help
Contact GitHub
API
Training
Shop
Blog
About