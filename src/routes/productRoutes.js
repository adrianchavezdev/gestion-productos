const router = require('express').Router();
const auth = require('../middlewares/authMiddleware');
const c = require('../controllers/productController');

router.use(auth); // protege TODAS las rutas de productos

router.post('/', c.crear);
router.get('/', c.listar);
router.get('/:id', c.obtener);
router.put('/:id', c.actualizar);
router.delete('/:id', c.eliminar);

module.exports = router;