# authRouter
post /signup
post /login
post /logout

# profileRouter
get /profile/view
patch /profile/edit
patch /profile/password

# connectionRequestRouter
post /request/send/interested/:userId
post /request/send/ignored/:userId

post /request/review/accepted/:requestId
post /request/review/rejected/:requestId

# userRouter
get /user/connections
get /user/requests
get /user/feed - gets the profiles of other users on platform


status: ignore, interested, accepted, rejected

