/*   default routes of SPA

FRONTEND:
List of Users           /                   always reachable
List of places for user /:userId/places/    always reachable
Signup + Login Forms    /authenticate       only un-authenticated
New Place Form          /places/new         authenticated
Update Place Form       /places/:placeId    authenticated         /всегда после new


BACKEND API Endpoints:
/api/users/       /api/places
GET  /              GET  /user/:uid    PATCH /:uid
POST /signup        GET  /:pid         DELETE /:pid
POST /login         POST /

*/
