module.exports = {
    landingPage: async (req, res) => {
        const message = 'Hello Guys';
        res.status(200).json({message});

    },
}