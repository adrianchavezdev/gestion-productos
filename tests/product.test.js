jest.mock('../src/models/Product', () => ({
  create: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

const Product = require('../src/models/Product');
const productController = require('../src/controllers/productController');

describe('productController', () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: { nombre: 'Teclado', precio: 500 },
      params: { id: 'product-id' },
      user: { id: 'user-id' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('crear', () => {
    it('crea el producto con el usuario autenticado y responde 201', async () => {
      const producto = { _id: 'product-id', ...req.body, creadoPor: req.user.id };
      Product.create.mockResolvedValue(producto);

      await productController.crear(req, res);

      expect(Product.create).toHaveBeenCalledWith({ ...req.body, creadoPor: req.user.id });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(producto);
    });

    it('responde 400 cuando falla la creación', async () => {
      Product.create.mockRejectedValue(new Error('Datos inválidos'));

      await productController.crear(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Datos inválidos' });
    });
  });

  describe('listar', () => {
    it('responde con todos los productos', async () => {
      const productos = [{ _id: 'product-id' }];
      Product.find.mockResolvedValue(productos);

      await productController.listar(req, res);

      expect(Product.find).toHaveBeenCalledWith();
      expect(res.json).toHaveBeenCalledWith(productos);
    });

    it('responde 500 cuando falla la consulta', async () => {
      Product.find.mockRejectedValue(new Error('Error de consulta'));

      await productController.listar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Error de consulta' });
    });
  });

  describe('obtener', () => {
    it('responde con el producto encontrado', async () => {
      const producto = { _id: req.params.id };
      Product.findById.mockResolvedValue(producto);

      await productController.obtener(req, res);

      expect(Product.findById).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith(producto);
    });

    it('responde 404 cuando el producto no existe', async () => {
      Product.findById.mockResolvedValue(null);

      await productController.obtener(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto no encontrado' });
    });

    it('responde 400 cuando el ID es inválido', async () => {
      Product.findById.mockRejectedValue(new Error('ID inválido'));

      await productController.obtener(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'ID inválido' });
    });
  });

  describe('actualizar', () => {
    it('actualiza el producto y responde con el resultado', async () => {
      const producto = { _id: req.params.id, ...req.body };
      Product.findByIdAndUpdate.mockResolvedValue(producto);

      await productController.actualizar(req, res);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      expect(res.json).toHaveBeenCalledWith(producto);
    });

    it('responde 404 cuando el producto no existe', async () => {
      Product.findByIdAndUpdate.mockResolvedValue(null);

      await productController.actualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto no encontrado' });
    });

    it('responde 400 cuando falla la actualización', async () => {
      Product.findByIdAndUpdate.mockRejectedValue(new Error('Datos inválidos'));

      await productController.actualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Datos inválidos' });
    });
  });

  describe('eliminar', () => {
    it('elimina el producto encontrado', async () => {
      Product.findByIdAndDelete.mockResolvedValue({ _id: req.params.id });

      await productController.eliminar(req, res);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith(req.params.id);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto eliminado' });
    });

    it('responde 404 cuando el producto no existe', async () => {
      Product.findByIdAndDelete.mockResolvedValue(null);

      await productController.eliminar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'Producto no encontrado' });
    });

    it('responde 400 cuando el ID es inválido', async () => {
      Product.findByIdAndDelete.mockRejectedValue(new Error('ID inválido'));

      await productController.eliminar(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ mensaje: 'ID inválido' });
    });
  });
});