// Password strength meter
// This jQuery plugin is written by firas kassem [2007.04.05]
// Firas Kassem  phiras.wordpress.com || phiras at gmail {dot} com
// for more information : http://phiras.wordpress.com/2007/04/08/password-strength-meter-a-jquery-plugin/

function passwordStrength(password,username) {
    var shortPass = 1, badPass = 2, goodPass = 3, strongPass = 4, score = 0, d, s, u, l;

    //password < 4
    if (password.length < 4 ) { return shortPass };

    //password == username
    if (password.toLowerCase()==username.toLowerCase()) return badPass;

    //password length
    score += password.length * 4;
    score += ( checkRepetition(1,password).length - password.length ) * 1;
    score += ( checkRepetition(2,password).length - password.length ) * 1;
    score += ( checkRepetition(3,password).length - password.length ) * 1;
    score += ( checkRepetition(4,password).length - password.length ) * 1;

    d = password.match(/\d/g);
    s = password.match(/[^\d\w]/g);
    u = password.match(/[A-Z]/g);
    l = password.match(/[a-z]/g);

	//password has 3 numbers
    if ( d && d.length > 2 ) score += 5;

    //password has 2 sybols
    if ( s && s.length > 1 ) score += 10;

    //password has Upper and Lower chars
    if ( u && l ) score += 10;

    //password has number and chars
    if ( u && l && d ) score += 15;
    //
    //password has number and symbol
    if ( s && d ) score += 15;

    //password has Upper char and symbol
    if ( u && s ) score += 15;

    //password is just a nubers or chars
    if ( ! s )  score -= 10;

    //verifing 0 < score < 100
    if ( score < 0 )  score = 0;
    if ( score > 100 )  score = 100;

    if ( score < 34 ) return badPass;
    if ( score < 68 || password.length < 7 ) return goodPass;
    return strongPass;
}


// checkRepetition(1,'aaaaaaabcbc')   = 'abcbc'
// checkRepetition(2,'aaaaaaabcbc')   = 'aabc'
// checkRepetition(2,'aaaaaaabcdbcd') = 'aabcd'

function checkRepetition(pLen,str) {
    res = ""
    for ( i=0; i<str.length ; i++ ) {
        repeated=true
        for (j=0;j < pLen && (j+i+pLen) < str.length;j++)
            repeated=repeated && (str.charAt(j+i)==str.charAt(j+i+pLen))
        if (j<pLen) repeated=false
        if (repeated) {
            i+=pLen-1
            repeated=false
        }
        else {
            res+=str.charAt(i)
        }
    }
    return res
}

