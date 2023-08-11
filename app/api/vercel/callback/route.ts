export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    try{
    const token = await fetch(`https://api.vercel.com/v2/oauth/access_token`,
        {
            method: 'POST',
            headers:{
                'Content-Type': `application/x-www-form-urlencoded`,
            },
            body: `client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}&code=${code}&redirect_uri=https://vercel-bisect.vercel.app/api/vercel/callback`
        })


    console.log(await token.json())
    // TODO: save bearer token & redirect to the main
}catch(e){
        console.log('error', e)
}

}


//Next steps:
// 1. Save token in cookies for now
// 2. Get all deployments between good and bad (pagination)
// 3. Create logic for binary search (recursive function)

