Create a repository
Initialize the repo
node_modules, package.json, package-lock.json

Install express
create server
listen to port 7000
write req handlers
install nodemon and update scripts inside package.json

initialize git
create remote repo on github

--
What are dependencies:
Difference between caret and tilde (^ vs ~)
Order of routes matters a lot


express json
Js obj vs JSON 
validator package
bcrypt

what happens when user try to login?
User makes a login req using email and password, the server says email and password is correct and server sends a jwt cookie (json web token) back to user.
User stores jwt

Everytime user makes a req, it sends this cookie token and server validates this token everytime.

we can send cookie using res.cookie
res.cookie("token", "cookie789");

and we can read using "cookie-parser" and req.cookies

jwt - it has 3 parts - header,payload,signature
 
Using jsonwebtoken package we can create jwt