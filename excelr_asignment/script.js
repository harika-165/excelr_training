let events = [];

document.getElementById('eventForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const title = document.getElementById('title').value.trim();
  const description = document.getElementById('description').value.trim();
  const dateTime = document.getElementById('dateTime').value;
  const email = document.getElementById('email').value.trim();
  const category = document.getElementById('category').value;

  if (!title || !dateTime || !category) {
    alert("Please fill in all required fields.");
    return;
  }

  const eventTime = new Date(dateTime);
  if (eventTime <= new Date()) {
    alert("Event time must be in the future.");
    return;
  }

  const newEvent = {
    id: Date.now(),
    title,
    description,
    dateTime: eventTime,
    email,
    category,
    reminderSent: false
  };

  events.push(newEvent);
  renderEvents();
  this.reset();
});

function renderEvents() {
  const list = document.getElementById('eventList');
  list.innerHTML = '';

  events.forEach(event => {
    const card = document.createElement('div');
    card.className = 'card';

    const now = new Date();
    const diff = event.dateTime - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    let content = `
      <strong>${event.title}</strong><br>
      <em>${event.description || ''}</em><br>
      <span class="timer">${diff <= 0 ? `🎉 ${event.title} is happening now!` :
        `${days}d ${hours}h ${mins}m ${secs}s`}</span><br>
      <small>Category: ${event.category}</small><br>
      ${event.email ? `<small>Email: ${event.email}</small><br>` : ''}
    `;

    card.innerHTML = content;
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.className = 'delete';
    delBtn.onclick = () => {
      if (confirm(`Are you sure you want to delete "${event.title}"?`)) {
        events = events.filter(e => e.id !== event.id);
        renderEvents();
      }
    };
    card.appendChild(delBtn);

    list.appendChild(card);

    if (!event.reminderSent && event.email) {
      const oneDayBefore = new Date(event.dateTime.getTime() - (24 * 60 * 60 * 1000));
      if (now >= oneDayBefore && now < event.dateTime) {
        console.log(`Reminder sent to ${event.email} for event: ${event.title}`);
        event.reminderSent = true;
      }
    }
  });
}

setInterval(renderEvents, 1000);
