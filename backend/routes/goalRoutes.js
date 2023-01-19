const express = require('express')
const router = express.Router()

const { getGoals,
    postGoals,
    updateGoals,
    deleteGoals} = require('../controllers/goalController')


// router.get('/', getGoals)
// router.post('/',postGoals) 
// router.put('/:id',updateGoals) 
// router.delete('/:id',deleteGoals) 


const {protect} = require('../middleware/authMiddleware')

// More cleaner
router.route('/').get(protect,getGoals).post(protect, postGoals)
router.route('/:id').delete(protect, deleteGoals).put(protect, updateGoals)




module.exports = router