const fs = require('fs');
const p = 'd:/Github/Stephen/Frontend/src/App.tsx';
let c = fs.readFileSync(p, 'utf8');

// Inject handleAdminToggleUserStatus
const target = `  // Restore logged-in user profile from Laravel API on app load`;
const injected = `  const handleAdminToggleUserStatus = async (userId: number) => {
    const token = localStorage.getItem('tasklink_token');
    if (!token) return;
    try {
      const res = await fetch(\`http://tasklink.test/api/admin/users/\${userId}/suspend\`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': \`Bearer \${token}\`
        }
      });
      if (res.ok) {
        const data = await res.json();
        showToast('Status Updated', data.message, 'info');
        setAdminUsersList(prev => prev.map(u => u.id === userId ? { ...u, status: data.status } : u));
      } else {
        const err = await res.json();
        showToast('Action Failed', err.message || 'Could not update user status.', 'error');
      }
    } catch (err) {
      console.error('Failed to toggle user status:', err);
    }
  };

  // Restore logged-in user profile from Laravel API on app load`;

c = c.replace(target, injected);

// Update onClick
const target2 = `                                      <button 
                                        onClick={() => {
                                          setAdminUsersList(prev => prev.map(u => u.id === user.id ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
                                          showToast('Status Updated', \`User \${user.name} status updated.\`, 'info');
                                        }}`;
const injected2 = `                                      <button 
                                        onClick={() => handleAdminToggleUserStatus(user.id)}`;
c = c.replace(target2, injected2);

fs.writeFileSync(p, c);
