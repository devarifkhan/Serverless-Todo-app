const {CognitoJwtVerifier}=require('aws-jwt-verify');

const jwtVerifier=CognitoJwtVerifier.create({
    userPoolId:process.env.COGNITO_USER_POOL_ID,
    tokenUse:"id",
    clientId:process.env.COGNITO_CLIENT_ID,
});
const generatePolicy = (principalId,effect,resource)=>{
    var authResponse={};
    authResponse.principalId=principalId;

    if(effect&&resource){
        let policyDocument={
            Version:"2012-10-17",
            Statement:[
                {
                    Effect:effect,
                    Resource: resource,
                    Action: "execute-api:Invoke"

                }
            ]
        }
        authResponse.policyDocument=policyDocument;

    }



    authResponse.context={
        "name":"ariful"
    }

    console.log(JSON.stringify(authResponse));
    return authResponse;
}



export const tokenAuthorizer=(event,context,callback)=>{
    //lambda authorizer
    var token =event.authorizationToken;
    console.log(token);

    //validate the token
    try {
        const payload=jwtVerifier.verify(token);
        console.log(payload);
        callback(null,generatePolicy(payload.sub,"Allow",event.methodArn));
        return;
    } catch (error) {
        console.log(error);
        callback("Unauthorized");
        return;
         
    }


    // switch(token){
    //     case "allow":
    //         callback(null,generatePolicy("user","Allow",event.methodArn)); 
    //         break;
    //     case "deny":
    //        callback(null,generatePolicy("user","Deny",event.methodArn));
    //         break;
    //     default:
    //         throw new Error("Unauthorized");
    
    // }



}