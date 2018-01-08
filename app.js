console.log("Ready...");

let count = 0;
let maxCount = 1000;
let state = 'NY';

let lat, lng;
let latLow, latUpper, lngLow, lngUpper;
let startTime = new Date();
var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;

var driver = new webdriver.Builder()
    .forBrowser('firefox')
    .build();

    //driver.manage().window().maximize();


switch(state){
  case 'CA':
    latLow = 32.3;
    latUpper = 42.013;
    lngLow = -124.69;
    lngUpper = -114.146;
    break;
  case 'CT':
    latLow = 40.97;
    latUpper = 42.103;
    lngLow = -73.77;
    lngUpper = -71.75;
    break;
  case 'FL':
    latLow = 24.331;
    latUpper = 31.331;
    lngLow = -87.758;
    lngUpper = -79.56;
    break;
  case 'IL':
    latLow = 36.925;
    latUpper = 42.514;
    lngLow = -91.838;
    lngUpper = -87.44;
    break;
  case 'NJ':
    latLow = 38.83;
    latUpper = 41.42;
    lngLow = -75.72;
    lngUpper = -73.83;
    break;
  case 'NV':
    latLow = 34.05;
    latUpper = 42.05;
    lngLow = -120.105;
    lngUpper = -113.95;
    break;
  case 'NY':
    latLow = 40.432;
    latUpper = 45.021;
    lngLow = -80.1222;
    lngUpper = -71.5197;
    break;
  case 'TX':
    latLow = 25.59;
    latUpper = 36.659;
    lngLow = -106.66;
    lngUpper = -93.39;
    break;
  case 'PA':
    latLow = 39.715;
    latUpper = 42.248;
    lngLow = -80.533;
    lngUpper = -74.76;
    break;
  default:
    console.log('No coordinates for selected state');
    process.exit();
}

driver.get('http://localhost/intranet/updateUserCoordinates2').then(start);

function start(){
  console.log('starting');
  var promiseChain = [];

  for (var i =0; i<maxCount; i++){
    promiseChain.push(clicking(driver, i));
  }

  Promise.all([promiseChain]).then(finished(driver));
}


function clicking(driver, i){
  //driver.wait()sleep(1*1000);
  driver.findElement( By.id('clickme') ).click()
  .then(function(){

    latElem = driver.findElement( By.id('lat') );
    lngElem = driver.findElement( By.id('lng') );

    driver.wait(until.elementIsEnabled(latElem), 10000);
    driver.wait(until.elementIsEnabled(lngElem), 10000);

  }).then(function(){
    driver.findElement( By.id('lng') ).getAttribute('value').then(function(value){
      lng = value;
    });
    driver.findElement( By.id('lat') ).getAttribute('value').then(function(value){
      lat = value;
    });

  }).then(function(){
    if(latLow < lat  && lat < latUpper &&  lngLow < lng && lng < lngUpper  )
    {
      console.log(i);
    }
    else{
      console.log("coordinates out of state bounds");
      process.exit();
    }


  }, function(err){
    if(err.name == 'NoSuchElementError' || err.name == 'StaleElementReferenceError'){

      console.log("sleep delay");
      driver.sleep(2*1000);
      //driver.get('http://localhost/jf/updateUserCoordinates2');
      //clicking(driver);
    }else if ( err.name == 'UnexpectedAlertOpenError') {
      console.log("alert box message");

      driver.sleep(5*1000);
      process.exit();
    }else{
      console.log(err);
      driver.sleep(5*1000);
      process.exit();
    }

  }).then(function(){
    driver.findElement( By.id('update') ).click();
  }).then(function(){
    driver.wait(until.elementLocated(By.id('ready')), 30000);
    let ready = driver.findElement(By.id('ready'));
    driver.wait(until.elementIsVisible(ready), 30000);

  });



}

function finished(driver){

  driver.sleep(1*1000).then(function(){
    let endTime = new Date();
    let time = (endTime - startTime);
    if(time > 60*1000){
      msg = Math.round(time/60/1000) + " minutes  ";
      msg += Math.round(time % 60) + " seconds ";
    }else{
      msg = Math.round(time/1000) + " seconds";
    }
    console.log('Time elapsed: ' + msg );
    console.log("Finished!")
  }, null);
  driver.quit();
}
