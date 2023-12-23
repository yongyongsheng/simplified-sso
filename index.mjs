export const handler = async (event) => {

  let response;

  const tenant = process.env.tenant;
  const client_id = process.env.client_id;
  const client_secret = process.env.client_secret;
  const redirect_uri = process.env.redirect_uri
  
  let state = ''
  
  console.log(event);
  
  
  if (event.rawPath.length > 1) {
    
    state = event.rawPath.substring(1)
  
    let azure_url = 'https://login.microsoftonline.com/'+tenant+'/oauth2/v2.0/authorize?client_id='+client_id
    azure_url += '&scope=https%3A%2F%2Fgraph.microsoft.com%2FUser.Read&state='+state
    azure_url += '&response_type=code&redirect_uri='+encodeURIComponent(redirect_uri)
  
    response = {
      statusCode: 200,
      headers: {
        "content-type": "text/html"
      },
      body: '<html><head><meta http-equiv="refresh" content="0; url='+azure_url+'"></head><body>Redirecting to login ('+state+')..</body></html>',
    };
    return response;
  }
  
  if (event.rawPath == '/') {
    
    let c1=event.rawQueryString.indexOf('code=');
    let c2=event.rawQueryString.indexOf('state=');
    let c3=event.rawQueryString.indexOf('session_state=');
    let code = event.rawQueryString.substring(c1+5,c2-1)
    state = event.rawQueryString.substring(c2+6,c3-1)
    
    if (code=='') {
      response = {
        statusCode: 200,
        body: JSON.stringify('Missing parameters')
      };
      return response;
    } 
  
    var details = {
        'client_id': client_id,
        'client_secret': client_secret,
        'redirect_uri': redirect_uri,
        'grant_type': 'authorization_code',
        'code': code
    };
    
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    
    let boardResponse = await fetch('https://login.microsoftonline.com/'+tenant+'/oauth2/v2.0/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody
    })
    console.log('boardResponse', boardResponse)
    console.log('state', state)
    let boardData = await boardResponse.json();
    
    if (boardData && boardData.access_token){
      
      var headers = {}
      headers['Authorization'] = 'Bearer ' + boardData.access_token

      let checklistsResponse = await fetch('https://graph.microsoft.com/v1.0/me', { method: 'GET', headers: headers});
      let checklistsData = await checklistsResponse.json();  
      
      console.log('state2',state);
      
      response = {
        statusCode: 200,
        body: JSON.stringify({
          'displayName': checklistsData.displayName,
          'mail': checklistsData.mail,
          'jobTitle': checklistsData.jobTitle,
          'state': state
        }),
      };
      return response;
    }
      
    let err_msg = (boardData && boardData.error) ? boardData.error_description : 'Error processing tokens';

    response = {
      statusCode: 200,
      body: JSON.stringify(err_msg),
    };
    return response;
  }
  

  response = {
    statusCode: 200,
    body: JSON.stringify('Missing parameters'),
  };
  return response;
};
