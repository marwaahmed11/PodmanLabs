const Docker = require('dockerode');
const path = require('path');
const fs = require('fs');

const docker = new Docker();

async function buildAndRun() {
  try {
    // Path to your Containerfile directory
    const contextPath = path.resolve(__dirname);

    // Read your Containerfile (for logging or validation)
    const dockerfilePath = path.join(contextPath, 'Containerfile');
    if (!fs.existsSync(dockerfilePath)) {
      throw new Error('Containerfile not found in current directory.');
    }

    console.log('Building image...');
    const stream = await docker.buildImage(
      {
        context: contextPath,
        src: fs.readdirSync(contextPath),
      },
      {
        t: 'hello-server:latest',
        dockerfile: 'Containerfile',
      }
    );

    await new Promise((resolve, reject) => {
      docker.modem.followProgress(stream, (err, res) =>
        err ? reject(err) : resolve(res)
      );
    });

    console.log('Image built successfully!');

    console.log('Starting container...');
    const container = await docker.createContainer({
      Image: 'hello-server:latest',
      name: 'hello-server-container',
      Tty: true,
      ExposedPorts: { '3000/tcp': {} }, // expose port 3000
      HostConfig: {
        PortBindings: {
          '3000/tcp': [{ HostPort: '3000' }], //  bind container:host 3000
        },
      },
    });

    await container.start();

    console.log(' Container started! Access your app at http://localhost:3000');
  } catch (err) {
    console.error(' Error:', err);
  }
}

buildAndRun();

