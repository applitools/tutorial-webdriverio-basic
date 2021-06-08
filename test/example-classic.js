'use strict';

const webdriverio = require('webdriverio');
const {
    ClassicRunner,
    Eyes,
    Target,
    Configuration,
    RectangleSize,
    BatchInfo
} = require('@applitools/eyes.webdriverio');


let driver;
let eyes;

describe('wdio', function () {

    beforeEach(async () => {
        const chrome = {
            desiredCapabilities: {
                browserName: 'chrome'
            },
            host: (process.env.CI === 'true') ? 'selenium' : '127.0.0.1'
        };

        // Use Chrome browser
        driver = webdriverio.remote(chrome);
        await driver.init();

        // Initialize the Runner for your test.
        const runner = new ClassicRunner();

        // Initialize the eyes SDK
        eyes = new Eyes(runner);

        // Initialize the eyes configuration
        const configuration = new Configuration();

        // Set new batch
        configuration.setBatch(new BatchInfo('Demo batch'))

        // Set the configuration to eyes
        eyes.setConfiguration(configuration);
    });

    it('Classic Runner Test', async () => {

        // Start the test by setting AUT's name, test name and viewport size (width X height)
        await eyes.open(driver, 'Demo App - WDIO 4', 'Smoke Test', new RectangleSize(800, 600));

        // Navigate the browser to the "ACME" demo app.
        await driver.url('https://demo.applitools.com');

        // To see visual bugs after the first run, use the commented line below instead.
        // await driver.url("https://demo.applitools.com/index_v2.html");

        // Visual checkpoint #1.
        await eyes.check('Login Window', Target.window().fully());

        // Click the "Log in" button.
        await driver.click('#log-in');

        // Visual checkpoint #2.
        await eyes.check('App Window', Target.window().fully());

        // End the test
        eyes.close();
    });

    afterEach(async () => {
        // Close the browser
        await driver.end();

        // If the test was aborted before eyes.close was called, ends the test as aborted.
        await eyes.abort();

        // Wait and collect all test results
        const results = await eyes.getRunner().getAllTestResults(false);
        console.log(results);
        console.log(results.getAllResults());
    });

});
