async function err_handle(e, res) {
    const E_PATH = e.response.data.status
    console.log(E_PATH)
    res.status(E_PATH.status_code).json({success: false, reason: E_PATH.message})
    return
}

module.exports = {err_handle}