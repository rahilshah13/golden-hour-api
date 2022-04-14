async function createEvent(req, res, next) {
    const event = req.body;
    if (!event.name || !event.date || !event.time || !event.location || !event.description) {
        res.status(400).send('Missing required fields.');
    } else {
        next();
    }
}

// check to make sure event hasnt occurred yet
async function deleteEvent(req, res, next) {
    const eventId = req.params.id;
    if (!eventId) {
        res.status(400).send('Missing required fields.');
    } else {
        const event = await pool.query('SELECT * FROM events WHERE id = $1', [eventId]);
        if (event.rows.length === 0) {
            res.status(404).send('Event not found.');
        } else {
            const result = await pool.query('DELETE FROM events WHERE id = $1', [eventId]);
            res.status(200).send('Event deleted.');
        }
    }
}

async function getEvents(req, res, next) {
    const events = await pool.query('SELECT * FROM events');
    res.status(200).json(events.rows);
}

async function updateEvent(req, res, next) {
    const event = req.body;
    if (!event.name || !event.date || !event.time || !event.location || !event.description) {
        res.status(400).send('Missing required fields.');
    } else {
        next();
    }
}

async function banUser() {
    const userId = req.params.id;
    if (!userId) {
        res.status(400).send('Missing required fields.');
    } else {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            res.status(404).send('User not found.');
        } else {
            const result = await pool.query('UPDATE users SET banned = true WHERE id = $1', [userId]);
            res.status(200).send('User banned.');
        }
    }
}

async function unbanUser(req, res, next) {
    const userId = req.params.id;
    if (!userId) {
        res.status(400).send('Missing required fields.');
    } else {
        const user = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
        if (user.rows.length === 0) {
            res.status(404).send('User not found.');
        } else {
            const result = await pool.query('UPDATE users SET banned = false WHERE id = $1', [userId]);
            res.status(200).send('User unbanned.');
        }
    }
}

async function getBannedUsers(req, res, next) {
    const users = await pool.query('SELECT * FROM users WHERE banned = true');
    res.status(200).json(users.rows);
}

async function getEventsByUser(req, res, next) {
    const userId = req.params.id;
    if (!userId) {
        res.status(400).send('Missing required fields.');
    } else {    
        const events = await pool.query('SELECT * FROM events WHERE user_id = $1', [userId]);
        res.status(200).json(events.rows);
    }
}



getAnonymousStatistics = async (req, res) => {
    const statistics = await pool.query('SELECT * FROM statistics');
    res.status(200).json(statistics.rows);
}


module.exports = {
    isAdmin,
};



















