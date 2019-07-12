'use strict';

const chromedriver = require('chromedriver');
const webdriverio = require('webdriverio');
const {
  By,
  ClassicRunner,
  Eyes,
  Target
} = require('@applitools/eyes.webdriverio');
const {Configuration} = require('@applitools/eyes-selenium');


let driver;
let eyes;

describe('wdio', function () {

  before(async function () {
    chromedriver.start();
  });

  beforeEach(async () => {
    const chrome = {
      desiredCapabilities: {
        browserName: 'chrome'
      }
    };
    driver = webdriverio.remote(chrome);
    await driver.init();
  });

  afterEach(async () => {
    await driver.end();
    await eyes.abortIfNotClosed();

    const results = await eyes.getRunner().getAllTestResults(false);
    console.log(results);
  });

  after(async function () {
    chromedriver.stop();
  });

  it('Classic Runner Test', async () => {
    await driver.url('https://demo.applitools.com');

    const runner = new ClassicRunner();

    eyes = new Eyes(runner);

    const configuration = new Configuration();
    configuration.setAppName('Demo App');
    configuration.setTestName('Smoke Test');

    eyes.setConfiguration(configuration);
    driver = await eyes.open(driver);

    await driver.url('https://demo.applitools.com');

    // Visual checkpoint #1.
    await eyes.check('Login Window', Target.window());

    // Click the "Log in" button.
    await driver.click(By.id('log-in'));

    // Visual checkpoint #2.
    await eyes.check('App Window', Target.window());

    await eyes.closeAsync();
  });

});
