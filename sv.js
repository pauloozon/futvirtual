const puppeteer = require('puppeteer-extra')

const StealthPlugin = require('puppeteer-extra-plugin-stealth');

(async () => {

    puppeteer.use(StealthPlugin());
    
    /* const browser = await puppeteer.launch({
        //headless: false
    }); */

    const browser = await puppeteer.launch({
        headless: false,
        //userDataDir: path.resolve(__dirname, "./perfil"),
        args: [
            "--disable-infobars",
            "--no-sandbox",
            "--disable-blink-features=AutomationControlled",
        ],
        ignoreDefaultArgs: ["--enable-automation"],
    });
    
    const page = await browser.newPage();

    await page.evaluateOnNewDocument(() => {

        Object.defineProperty(navigator, 'maxTouchPoints', {
            get() {
                "¯\_(ツ)_/¯";
                return 1;
            },
        });
    
        "✌(-‿-)✌";
        navigator.permissions.query = i => ({then: f => f({state: "prompt", onchange: null})});
    
    });
    
    await page.goto('https://www.game-365.com/#/AVR/B146/R%5E1/');

    await page.waitForSelector('.vrl-MeetingsHeaderButton');

    var resultados = await page.evaluate(async () => {

        var getByClassName = function(className) {

            var search = document.getElementsByClassName(className);

            if (search && search.length >= 1) {
                return search[0];

            } else {
                return null;
            }
        }

        var sleep = async function (seconds) {
    
            console.log('Dormindo por ' + seconds + 'seg...');
        
            return new Promise((resolve, reject) => {
                setTimeout(resolve, seconds * 1000);
            });
        }

        var getActiveResults = function() {

            var results = [];

            var groups = document.getElementsByClassName('vrr-HeadToHeadMarketGroup');

            groups = Array.from(groups);

            groups.forEach(function(group) {

                console.log('Obtendo resultado', group);

                var detailsElm = group.querySelector('.vrr-FixtureDetails_Event');
                var scoreElm = group.querySelector('.vrr-HTHTeamDetails_Score');
                var homeTeamNameElm = group.querySelector('.vrr-HTHTeamDetails_TeamOne');
                var awayTeamNameElm = group.querySelector('.vrr-HTHTeamDetails_TeamTwo');

                var detailsElmText = detailsElm.innerText;
                var detailsElmTextParts = detailsElmText.split(' - ');

                var meeting = detailsElmTextParts[0];

                var eventTime = detailsElmTextParts[1];
                eventTime = eventTime.split('.').join(':');
                
                var scoreText = scoreElm.innerText;
                var homeTeamScore = '';
                var awayTeamScore = '';

                if (scoreText.includes('undefined')) {
                    scoreText = '';

                } else {

                    var scoreParts = scoreText.split(' - ');
                    
                    homeTeamScore = scoreParts[0];

                    awayTeamScore = scoreParts[1];
                }

                var result = {
                    meeting: meeting,
                    event_time: eventTime,
                    score: scoreText,
                    home_team_name: homeTeamNameElm.innerText,
                    home_team_score: homeTeamScore,
                    away_team_name: awayTeamNameElm.innerText,
                    away_team_score: awayTeamScore
                };

                results.push(result);

            });

            return results;
        }
        
        var getMeetingResults = async function (meetingHeaderButton, click) {

            var results = [];
            var error = null;

            try {

                // Clicar na aba do campeonato
                if (click) {
                    meetingHeaderButton.click();
                }
            
                var meetingHeaderButtonTitle = meetingHeaderButton.querySelector('.vrl-MeetingsHeaderButton_Title');
            
                var meetingTitle = meetingHeaderButtonTitle.innerText;
    
                console.log(`[${meetingTitle}] Buscando resultados...`);
    
                await sleep(3);
    
                var resultsButton = getByClassName('vr-ResultsNavBarButton');
    
                if (resultsButton) {

                    console.log(`[${meetingTitle}] Clicando na aba de resultados...`);

                    resultsButton.click();
                    
                    await sleep(3);

                    results = getActiveResults();
    
                } else {
                    throw 'Não foi possível encontrar a aba de resultados';
                }

            } catch (e) {
                error = e;
            }

            return { results, error };
        };
        
        var meetingsHeaderButtons = document.getElementsByClassName('vrl-MeetingsHeaderButton');

        meetingsHeaderButtons = Array.from(meetingsHeaderButtons);

        var results = [];

        for (var i = 0; i < meetingsHeaderButtons.length; i++) {
        //for (var i = 0; i < 1; i++) {

            var meetingButton = meetingsHeaderButtons[i];

            console.log('Buscando informações do campeonato', i);

            var meetingResults = await getMeetingResults(meetingButton, i != 0);

            if (meetingResults.error) {

            }

            if (meetingResults.results && meetingResults.results.length > 0) {
                
                console.log('Resultados obtidos', i, meetingResults.results);

                results = results.concat(meetingResults.results);
            }
        }

        return results;

    });

    console.log('resultados', resultados);
    
    //await browser.close();
    
})();
