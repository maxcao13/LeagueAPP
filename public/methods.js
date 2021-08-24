async function err_handle(e, res) {
    const E_PATH = e.response.data.status
    console.log(E_PATH)
    res.status(E_PATH.status_code).json({success: false, reason: E_PATH.message})
    return
}

function getChampionFromID(object, id) {
    for (let [champ, data] of Object.entries(object)) {
        if (Number(data.key) === id) {
            return champ
        } 
    }
}

module.exports = {err_handle, getChampionFromID}