# Authentication
## POST /auth
### Request Body
```json
{
  "callback_url": "Your frontend callback url"
}
```
### Response
```json
{
  "url": "https://discord.com/api/oauth2/authorize?client_id=123456789&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&response_type=code&scope=identify%20guilds"
}
```
## POST /auth/callback?code=X
### Request parameters
- **code**: The code you got from the 42 callback
### Response
```json
{
  "state": "'Connected' or 'Created' depending on if the account was already created to the app or not",
  "tokens": {
	"access_token": "JWT access token containing 'user' object with 'id' and 'login'. 180sec lifetime",
	"refresh_token": "JWT refresh token usable 1 time to get a new access token. 7d lifetime",
  }
}
```
## POST /auth/refresh
### Request body
```json
{
	"refresh_token": "The refresh token you got previously"
}
```
### Response
```json
{
	"access_token": "JWT access token containing 'user' object with 'id' and 'login'. 180sec lifetime",
	"refresh_token": "JWT refresh token usable 1 time to get a new access token. 7d lifetime",
}
```
## POST /auth/logout
### Request body
```json
{
	"refresh_token": "The refresh token you got previously"
}
```
### Response
```json
{
	"message": "Successfully logged out"
}
```
## Use token
For all the following endpoints, you need to add the following header:
```
authorization: Bearer [access_token]
```
# Account
## DELETE /account
### Response
```json
{
	"message": "Successfully deleted account"
}
```
# Stats
## GET /stats
### Response
```json
{
	"datas": {
		"TODO": "to fill"
	}
}
```
## GET /stats/me
### Response if stats are not generated yet
```json
{
  "state": "generating"
}
```
### Response if stats are available
```json
{
	"state": "generated",
	"datas": {
		"TODO": "to fill"
	}
}
```
## GET /stats/:login
### Response if stats are not available
```
403 Forbidden
```
### Response if stats are available
```json
{
	"login": "The login of the user",
	"datas": {
		"TODO": "to fill"
	}
}
```
# Settings
## GET /settings
### Response
```json
{
	"shared": "Are the stats shared with the community",
	"anonymously": "Are the stats shared anonymously",
}
```
## POST /settings
### Request body
```json
{
	"shared": "Are the stats shared with the community",
	"anonymously": "Are the stats shared anonymously",
}
```
### Response
```json
{
	"shared": "Are the stats shared with the community",
	"anonymously": "Are the stats shared anonymously",
}
```