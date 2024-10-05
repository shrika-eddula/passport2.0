const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
  const createWorkflowButton = document.getElementById('create-workflow');
  const queryInput = document.getElementById('query-input');
  const workflowOutput = document.getElementById('workflow-output');

  createWorkflowButton.addEventListener('click', () => {
    const query = queryInput.value;
    workflowOutput.innerHTML = '<h3>Processing...</h3>';
    ipcRenderer.send('create-workflow', query);
  });

  ipcRenderer.on('workflow-progress', (event, message) => {
    if (message.startsWith('sagemaker.config')) {
      // Ignore SageMaker config messages
      return;
    }
    try {
      const data = JSON.parse(message);
      if (data.progress) {
        workflowOutput.innerHTML += `<p>${data.progress}</p>`;
      } else if (data.result) {
        workflowOutput.innerHTML = `<h3>Generated Workflow:</h3><pre>${data.result}</pre>`;
      } else if (data.error) {
        workflowOutput.innerHTML = `<h3>Error:</h3><pre>${data.error}</pre>`;
      }
    } catch (error) {
      console.error('Error parsing progress message:', error);
      workflowOutput.innerHTML += `<p>${message}</p>`;
    }
  });

  ipcRenderer.on('workflow-error', (event, error) => {
    workflowOutput.innerHTML = `<h3>Error:</h3><pre>${error}</pre>`;
    console.error('Workflow creation error:', error);
  });

  ipcRenderer.on('workflow-complete', () => {
    workflowOutput.innerHTML += '<p>Workflow creation completed.</p>';
  });
});