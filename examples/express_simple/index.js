const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

const wasteIo = async (millis) => {
  const start = Date.now();
  if (millis) {
    await new Promise((r) => setTimeout(r, millis));
  }
  const delta = (Date.now() - start) / 1_000;
  return delta;
};
const wasteCpu = () => {
  return Array.from({ length: 10_000 }, (_, i) => Math.atan2(Math.sin(i), Math.cos(i + 1))).reduce((a, b) => a + b, 0);
};

const wasteRam = (megs = 16) => {
  const arr = new Uint8Array(megs * 2 ** 20);
  return arr.length;
};

const wasteGC = (megs = 0) => {
  const obj = {};
  obj.arr = new Uint8Array(megs * 2 ** 20);
  const l = obj.arr.length;
  delete obj.arr;
  try {
    if (global.gc) {
      global.gc();
    }
  } catch (e) {
    console.log('`node --expose-gc index.js`');
  }
  return l;
};

let wasteResources = async (io = 0, cpu = 0, ram = 0, garbage = 0) => {
  let wastedCpu = 0.0;
  let wastedRam = 0.0;
  let wastedGarbage = 0.0;

  let wastedIo = io ? await wasteIo(io) : 0;

  if (cpu) {
    wastedCpu += ((loopCount) => {
      const start = Date.now();
      while (loopCount-- > 0) wasteCpu();
      return (Date.now() - start) / 1000;
    })(cpu);
  }
  if (ram) {
    wastedRam += ((fun, param) => {
      const start = Date.now();
      fun(param);
      return (Date.now() - start) / 1000;
    })(wasteRam, ram);
  }
  if (garbage) {
    wastedGarbage += ((fun, param) => {
      const start = Date.now();
      fun(param);
      return (Date.now() - start) / 1000;
    })(wasteGC, garbage);
  }
  return (
    `Wasted ${wastedIo.toFixed(3)}s waiting, ${wastedCpu.toFixed(3)}s on CPU tasks, ` +
    `${wastedRam.toFixed(3)}s claiming RAM and ${wastedGarbage.toFixed(3)}s collecting garbage."`
  );
};
app.get('/', (req, res) => {
  const payload = `<html><body>
    <h1>Hello from ☊ Node ☋ soon to be scaled by Dynoscale!</h1>
    <table>
    <tr>
        <td><strong>Waste IO (Waiting)</strong></td>
        <td><a href="/io/1" target="activity"> 1ms</a></td>
        <td><a href="/io/2" target="activity"> 2ms</a></td>
        <td><a href="/io/5" target="activity"> 5ms</a></td>
        <td><a href="/io/10" target="activity"> 10ms</a></td>
        <td><a href="/io/20" target="activity"> 20ms</a></td>
        <td><a href="/io/50" target="activity"> 50ms</a></td>
        <td><a href="/io/100" target="activity"> 100ms</a></td>
        <td><a href="/io/200" target="activity"> 200ms</a></td>
        <td><a href="/io/500" target="activity"> 500ms</a></td>
        <td><a href="/io/1000" target="activity"> 1000ms</a></td>
        <td><a href="/io/2000" target="activity"> 2000ms</a></td>
        <td><a href="/io/5000" target="activity"> 5000ms</a></td>
    </tr>
    <tr>
        <td><strong>Waste CPU (Calculating)</strong></td>
        <td><a href="/cpu/1" target="activity"> 1x</a></td>
        <td><a href="/cpu/2" target="activity"> 2x</a></td>
        <td><a href="/cpu/5" target="activity"> 5x</a></td>
        <td><a href="/cpu/10" target="activity"> 10x</a></td>
        <td><a href="/cpu/20" target="activity"> 20x</a></td>
        <td><a href="/cpu/50" target="activity"> 50x</a></td>
        <td><a href="/cpu/100" target="activity"> 100x</a></td>
        <td><a href="/cpu/200" target="activity"> 200x</a></td>
        <td><a href="/cpu/500" target="activity"> 500x</a></td>
        <td><a href="/cpu/1000" target="activity"> 1000x</a></td>
        <td><a href="/cpu/2000" target="activity"> 2000x</a></td>
        <td><a href="/cpu/5000" target="activity"> 5000x</a></td>
    </tr>
    <tr>
        <td><strong>Waste RAM (Claiming and leaving)</strong></td>
        <td><a href="/ram/1" target="activity"> 1MB</a></td>
        <td><a href="/ram/2" target="activity"> 2MB</a></td>
        <td><a href="/ram/5" target="activity"> 5MB</a></td>
        <td><a href="/ram/10" target="activity"> 10MB</a></td>
        <td><a href="/ram/20" target="activity"> 20MB</a></td>
        <td><a href="/ram/50" target="activity"> 50MB</a></td>
        <td><a href="/ram/100" target="activity"> 100MB</a></td>
        <td><a href="/ram/200" target="activity"> 200MB</a></td>
        <td><a href="/ram/500" target="activity"> 500MB</a></td>
        <td><a href="/ram/1000" target="activity"> 1000MB</a></td>
        <td><a href="/ram/2000" target="activity"> 2000MB</a></td>
        <td><a href="/ram/5000" target="activity"> 5000MB</a></td>
    </tr>
    <tr>
        <td><strong>Waste GC (Claiming, Deleting and Requesting Garbage collection)</strong></td>
        <td><a href="/gc/1" target="activity"> 1MB</a></td>
        <td><a href="/gc/2" target="activity"> 2MB</a></td>
        <td><a href="/gc/5" target="activity"> 5MB</a></td>
        <td><a href="/gc/10" target="activity"> 10MB</a></td>
        <td><a href="/gc/20" target="activity"> 20MB</a></td>
        <td><a href="/gc/50" target="activity"> 50MB</a></td>
        <td><a href="/gc/100" target="activity"> 100MB</a></td>
        <td><a href="/gc/200" target="activity"> 200MB</a></td>
        <td><a href="/gc/500" target="activity"> 500MB</a></td>
        <td><a href="/gc/1000" target="activity"> 1000MB</a></td>
        <td><a href="/gc/2000" target="activity"> 2000MB</a></td>
        <td><a href="/gc/5000" target="activity"> 5000MB</a></td>
    </tr>
    </table>
    <iframe name="activity" src="/date" width="100%"></iframe>
    </body></html>`;
  res.send(payload);
});

app.get('/date', (req, res) => {
  res.send(`It's ${new Date()} right now.`);
});

app.get('/info', (req, res) => {
  let payload = '';
  payload += `### ${'.httpVersion '.padEnd(76, '#')}\n`;
  payload += `${req.httpVersion}\n\n`;

  payload += `### ${'.url '.padEnd(76, '#')}\n`;
  payload += `${req.url}\n\n`;

  payload += `### ${'.originalUrl '.padEnd(76, '#')}\n`;
  payload += `${req.originalUrl}\n\n`;

  payload += `### ${'.method '.padEnd(76, '#')}\n`;
  payload += `${req.method}\n\n`;

  payload += `### ${'.headers '.padEnd(76, '#')}\n`;
  Object.entries(req.headers).map((v, _, __) => {
    payload += `${v[0]}: ${v[1]}\n`;
  });
  payload += '\n';

  payload += `### ${'.rawHeaders '.padEnd(76, '#')}\n`;
  payload += `${req.rawHeaders.join('\n')}\n\n`;

  let body = [];
  req
    .on('data', (chunk) => {
      body.push(chunk);
    })
    .on('end', () => {
      payload += `### ${'BODY '.padEnd(76, '#')}\n`;
      payload += `${Buffer.concat(body).toString()}\n\n`;
    });

  payload += `### ${'.rawTrailers '.padEnd(76, '#')}\n`;
  payload += `${req.rawTrailers}\n\n`;

  res.set('Content-Type', 'text/plain');
  res.send(payload);
});

app.get('/io/:sleepMs', async (req, res) => {
  res.send(
    await wasteResources(
      parseInt(req.params.sleepMs),
      parseInt(req.params.loopCount),
      parseInt(req.params.ramClaimMegs),
      parseInt(req.params.gcClaimMegs),
    ),
  );
});

app.get('/cpu/:loopCount', async (req, res) => {
  res.send(
    await wasteResources(
      parseInt(req.params.sleepMs),
      parseInt(req.params.loopCount),
      parseInt(req.params.ramClaimMegs),
      parseInt(req.params.gcClaimMegs),
    ),
  );
});

app.get('/ram/:ramClaimMegs', async (req, res) => {
  res.send(
    await wasteResources(
      parseInt(req.params.sleepMs),
      parseInt(req.params.loopCount),
      parseInt(req.params.ramClaimMegs),
      parseInt(req.params.gcClaimMegs),
    ),
  );
});

app.get('/gc/:gcClaimMegs', async (req, res) => {
  res.send(
    await wasteResources(
      parseInt(req.params.sleepMs),
      parseInt(req.params.loopCount),
      parseInt(req.params.ramClaimMegs),
      parseInt(req.params.gcClaimMegs),
    ),
  );
});

app.listen(PORT, () => {
  console.log(`express_simple running and listening on port ${PORT}`);
});
