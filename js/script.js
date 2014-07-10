$(document).ready(function(){

userListPage();

/*---------functions---------*/
function UserEmail(login, user){

    $.ajax({
        url: "https://api.github.com/users/" + login,
        jsonp: "callback",
        dataType: "jsonp",
     
        success: function( response ) {
            var email = response.data.email;
            var p = document.createElement('P');
            if(email != null || email != undefined){
                p.innerHTML = email;
            }else{
                p.innerHTML = "Email is hidden";
            }
            document.getElementById("userlist").childNodes[user].childNodes[0].appendChild(p);
        }
    });
}

function userListPage(){
    $.ajax({
        url: "https://api.github.com/users",
        jsonp: "callback",
        dataType: "jsonp",

        success: function( response ) {

            for (var i = 0; i < 10; i++) {
                var avatar_url = response.data[i].avatar_url;
                var login = response.data[i].login;
                var div = document.createElement('DIV');
                div.setAttribute("class","user_list_div");
                var span = document.createElement('SPAN');
                span.setAttribute("class","user_span");
                var a = document.createElement('A');
                a.setAttribute("class","user");
                a.innerHTML = login;
                span.innerHTML = "<img class='preview' src=" + avatar_url + ">" + a;
                span.appendChild(a);
                document.getElementById("userlist").appendChild(div);
                document.getElementById("userlist").childNodes[i].appendChild(span);
                UserEmail(login, i);
            }
        }
    });
}

function reposList(login){

    $.ajax({
        url: "https://api.github.com/users/" + login + "/repos",
        jsonp: "callback",
        dataType: "jsonp",

        success: function( response ) {
            var ul = document.createElement('UL');
            ul.setAttribute("class","reposlist");
            var caption = document.createElement('LI');
            caption.setAttribute("class","caption_repos_list");
            caption.innerHTML = "<b>Repository List</b>";
            ul.appendChild(caption);
                for (var b = 0; b < response.data.length; b++) {
                    var li = document.createElement('LI');
                    li.setAttribute("class","repos_list_li");
                    var OneRepos = response.data[b].name;
                    li.innerHTML = OneRepos; 
                    ul.appendChild(li);
                }
            $('.userinfo').append(ul);
        }
    });
}

function infoUser(userLogin){

    $.ajax({
        url: "https://api.github.com/users/" + userLogin,
        jsonp: "callback",
        dataType: "jsonp",
     
        success: function( response ) {
            var avatar_url = response.data.avatar_url;
            var login = response.data.login;
            var name = response.data.name;
            var email = response.data.email;
            var div = document.createElement('DIV');
            div.setAttribute("class","userinfo");
            var back = document.createElement('BUTTON');
            back.setAttribute("class","back_button");
            back.innerHTML = "Back";
            var span = document.createElement('SPAN');
            span.setAttribute("class","full_information");
                if(email != null || email != undefined){
                    var isEmail = email;
                }else{
                    var isEmail = "Email is hidden";
                }
            span.innerHTML = "<img src=" + avatar_url + "><br>" + "<p><b>Login: </b><a class='user_log'>" + login + "</a></p><p>" + "<b>Full Name:</b> " + name +"</p>"+ "<p><b>Email:</b> "+isEmail +"</p>";
            div.appendChild(span);
            div.appendChild(back);
            $('#userlist').append(div);
            reposList(login);
        }
    });
}


function commmitList(userLogin, oneRepos){

    $.ajax({
        url: "https://api.github.com/repos/" + userLogin + "/" + oneRepos + "/commits",
        jsonp: "callback",
        dataType: "jsonp",

        success: function( response ) {
            var commitsList = document.createElement('UL');
            commitsList.setAttribute("class","commits_repos_list");
            var captionOfCommitsList = document.createElement('LI');
            captionOfCommitsList.setAttribute("class","caption_repos_list");
            captionOfCommitsList.innerHTML = "<b>Commits List</b>";
            commitsList.appendChild(captionOfCommitsList);
                for (var b = 0; b < response.data.length; b++) {
                    var li = document.createElement('LI');
                    li.setAttribute("class","commits_repos_list_li");
                    var commit = response.data[b].commit.message;
                    var authorCommit = response.data[b].commit.author.name;
                        if(commit.length >= 70){
                            var subCommit = commit.substring(0, 70) + " ...";
                        }else{
                            var subCommit = commit;
                        }
                    li.innerHTML = "<p class='sub_commit'>"+subCommit+"</p><p class='commit_message'>"+commit+"</p><p class='author_commit'>" + authorCommit + "</p>"; 
                    commitsList.appendChild(li);
                }
            $('div.info_repos').append(commitsList);
        }
    });
}

function reposInfo(userLogin, oneRepos){

    $.ajax({
        url: "https://api.github.com/repos/" + userLogin + "/" + oneRepos + "/branches",
        jsonp: "callback",
        dataType: "jsonp",

        success: function( response ) {
            var divRepos = document.createElement('DIV');
            divRepos.setAttribute("class","info_repos");
            var p = document.createElement('P');
            p.innerHTML = "<b>Author: </b>" + userLogin;
            divRepos.appendChild(p);
            var branchesList = document.createElement('UL');
            branchesList.setAttribute("class","branches_repos_list");
            var captionOfBranchesList = document.createElement('LI');
            captionOfBranchesList.setAttribute("class","caption_repos_list");
            captionOfBranchesList.innerHTML = "<b>Branches List</b>";
            branchesList.appendChild(captionOfBranchesList);
                for (var b = 0; b < response.data.length; b++) {
                    var li = document.createElement('LI');
                    var branch = response.data[b].name;
                    li.innerHTML = branch; 
                    branchesList.appendChild(li);
                }
            divRepos.appendChild(branchesList);
            $('.userinfo').append(divRepos);
            commmitList(userLogin, oneRepos);
        }
    });
}
/*---------end functions---------*/


$('#userlist').on('click', 'a.user', function(){
        var userLogin = $(this).text();
        $('#userlist div').slideUp( "slow");
        infoUser(userLogin);
});


$('#userlist').on('click', '.reposlist li.repos_list_li', function(){
    $('.userinfo span.full_information, .userinfo ul.reposlist').slideUp( "slow");
    var oneRepos = $(this).text();
    var divUserInfo = $(this).parent().parent();
    var login = divUserInfo.find("a.user_log").text();
    reposInfo(login, oneRepos);
});


$('#userlist').on('click', '.back_button', function(){
    if($('#userlist span.full_information').is(":visible")){
        $('#userlist div').slideDown("slow");
        $('.userinfo').slideUp("slow");
    }else if($('div.info_repos').is(":visible")){
        $('span.full_information, ul.reposlist').slideDown("slow");
        $('div.info_repos').slideUp("slow");
    }     
});


$('#userlist').on('click', 'ul.commits_repos_list li.commits_repos_list_li', function(){
    var currentLi = $(this).find("p.commit_message");
    var currentSubCommit = $(this).find("p.sub_commit");
    currentLi.slideToggle("slow", function(){
        if($(currentSubCommit).is(":visible")){
            currentSubCommit.slideUp();
        }else{
            currentSubCommit.slideDown();
        }
    });
});

});/*------------end code-----------------*/

