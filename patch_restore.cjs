const fs = require('fs');
const p = 'd:/Github/Stephen/Frontend/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

c = c.replace(/fetch\('http:\/\/tasklink\.test\/api\/user', \{\r?\n\s+headers: \{\r?\n\s+'Accept': 'application\/json',\r?\n\s+'Authorization': `Bearer \$\{token\}`,?\r?\n\s+\},?\r?\n\s+\}\)\r?\n\s+\.then\(res => res\.ok \? res\.json\(\) : null\)\r?\n\s+\.then\(user => \{\r?\n\s+if \(user\) \{/, 
`fetch('http://tasklink.test/api/user', {
        headers: {
          'Accept': 'application/json',
          'Authorization': \`Bearer \${token}\`,
        },
      })
        .then(res => {
          if (res && res.status === 403) {
            localStorage.removeItem('tasklink_token');
            showToast('Account Suspended', 'Your account is suspended. Please contact support.', 'error');
            return null;
          }
          return res && res.ok ? res.json() : null;
        })
        .then(user => {
          if (user) {
            if (user.verification_status === 'suspended') {
              localStorage.removeItem('tasklink_token');
              showToast('Account Suspended', 'Your account is suspended. Please contact support.', 'error');
              return;
            }`);

fs.writeFileSync(p, c);
console.log('Done replacement');
