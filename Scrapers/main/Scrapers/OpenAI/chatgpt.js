const {
  customConsoleLog,
  waitForElement,
  wait,
  bigStepper,
} = require('../../preloadFunctions');
const { ipcRenderer } = require('electron');

async function exportChatgpt(id, platformId, filename, company, name) {
  if (
    !window.location.href.includes('chatgpt.com/#settings/DataControls') &&
    !window.location.href.includes('mail.google.com') &&
    !window.location.href.includes('https://auth.openai.com/authorize')
  ) {
    bigStepper(id, 'Navigating to ChatGPT');
    customConsoleLog(id, 'Navigating to ChatGPT');
    window.location.assign('https://chatgpt.com/#settings/DataControls');
  }
  await wait(3);

  if (window.location.href.includes('chatgpt.com')) {
    if (document.querySelector('button[data-testid="login-button"]')) {
      customConsoleLog(id, 'YOU NEED TO SIGN IN (click the eye in the top right)!');
      bigStepper(id, 'Export stopped, waiting for sign in');
      ipcRenderer.send('connect-website', id);
      return 'CONNECT_WEBSITE';
    }

    customConsoleLog(id, `Waiting for Dialog Box`);

    const dialogBox = await waitForElement(
      id,
      'div[role="tablist"]',
      'Dialog Box',
      true,
    );

    if (!dialogBox) {
      customConsoleLog(id, 'YOU NEED TO SIGN IN (click the eye in the top right)!');
      bigStepper(id, 'Export stopped, waiting for sign in');
      ipcRenderer.send('connect-website', id);
      return 'CONNECT_WEBSITE';
    }

    customConsoleLog('Dialog Box found');

    const buttons = Array.from(document.querySelectorAll('button'));

    const exportBtn = buttons.find((button) => button.innerText === 'Export');

    bigStepper(id, 'Clicking on Export');
    exportBtn.click();

    const confirmExport = await waitForElement(
      id,
      '.btn.relative.btn-primary',
      'Confirm Export',
    );

    confirmExport.click();

    // TODO: automatically go to user's email and download the file
    await wait(3);
    bigStepper(id, 'Going to Gmail');
  }

  if (!window.location.href.includes('mail.google.com')) {
    window.location.assign('https://mail.google.com');
  }

  if (window.location.href.includes('mail.google.com')) {
    if (document.querySelector('h1')) {
      customConsoleLog(id, 'YOU NEED TO SIGN IN (click the eye in the top right)!');
      bigStepper(id, 'Export stopped, waiting for sign in');
      ipcRenderer.send('connect-website', id);
      return 'CONNECT_WEBSITE';
    }
    const checkEmails = async () => {
      const emails = await waitForElement(
        id,
        "div.xS[role='link']",
        'Download Email',
        true,
      );
      bigStepper(id, 'Checking for email');
      customConsoleLog(id, `Waiting for email from OpenAI`);
      for (const email of emails) {
        if (email.innerText.includes('ChatGPT - Your data export is ready')) {
          bigStepper(id, 'Email found, clicking it');
          email.click();
          return true; // Return true if the email is found
        }
      }
      return false; // Return false if the email is not found
    };

    let emailFound = false;
    let refreshCounter = 0;
    while (!emailFound) {
      emailFound = await checkEmails();
      if (!emailFound) {
        await wait(1);
        refreshCounter++;

        if (refreshCounter >= 5) {
          const refreshButton = document.querySelector(
            'div[role="button"][aria-label="Refresh"]',
          );
          if (refreshButton) {
            // had to simulate a click because gmail is weird
            ['mousedown', 'click', 'mouseup'].forEach((eventType) => {
              var event = new MouseEvent(eventType, {
                view: window,
                bubbles: true,
                cancelable: true,
              });
              refreshButton.dispatchEvent(event);
            });
            bigStepper(id, 'Refreshing emails');
            customConsoleLog(id, 'Refreshing emails');
            await wait(1); // Wait for refresh to complete
          }
          refreshCounter = 0;
        }
      }
    }
    // Wait for the email to load
    await wait(2);

    let downloadBtns = [];
    while (downloadBtns.length === 0) {
      customConsoleLog(id, `Waiting for Download button`);
      downloadBtns = await waitForElement(
        id,
        'a[href*="https://proddatamgmtqueue.blob.core.windows.net/exportcontainer/"]',
        'Download button',
        true,
      );
      if (downloadBtns.length === 0) {
        await wait(1); // Wait for 1 second before checking again
      }
    }
    customConsoleLog(id, 'Download button found, clicking it!');
    bigStepper(id, 'Downloading data');
    downloadBtns[downloadBtns.length - 1].click();
    return 'DOWNLOADING';
  }
}

module.exports = exportChatgpt;