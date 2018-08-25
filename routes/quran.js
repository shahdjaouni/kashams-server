const express=require('express');
const router=express.Router();
const quranController=require('../contollers/quran');

router.route('/')
.get(quranController.index)
.post(quranController.newQuran);

router.route('/:quranId')
.get(quranController.getQuran)
.put(quranController.replaceQuran)
.patch()
.delete();

router.route('/:quranId/amira')
.get(quranController.getQuranAmira)
.post(quranController.newQuranAmira);

module.exports = router;
