# DevTinder APIs

authRouter
- POST /signup
- POST /login 
- POST /logout

profileRouter
- GET /profile/view
- GET /profile/edit
- GET /profile/password

requestRouter
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

userRouter
- GET /user/connections
- GET /user/requests
- GET /user/feed  -gets you the profiles of the other users on the platform

Status: ignored, interested, accepted, rejected
