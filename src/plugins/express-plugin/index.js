const fs = require('fs-extra');
const path = require('path');

const ExpressPlugin = {
  name: 'express-plugin',
  version: '1.0.0',
  description: 'Express.js API server templates for DX',
  author: 'DX Team',

  /**
   * Initialize the plugin
   */
  initialize() {
    console.log('🚀 Express.js plugin initialized');
  },

  /**
   * Register plugin with DX API
   * @param {Object} api - DX Plugin API
   */
  register(api) {
    // Register Express templates
    api.registerTemplate('express-route', this.generateExpressRoute);
    api.registerTemplate('express-middleware', this.generateExpressMiddleware);
    api.registerTemplate('express-model', this.generateExpressModel);
    api.registerTemplate('express-controller', this.generateExpressController);
    api.registerTemplate('express-service', this.generateExpressService);

    // Register hooks
    api.registerHook('beforeGenerate', this.beforeGenerate);
    api.registerHook('afterGenerate', this.afterGenerate);

    api.log('express-plugin', 'Express.js templates registered successfully', 'success');
  },

  /**
   * Generate Express route
   * @param {string} name - Route name
   * @param {Object} options - Generation options
   */
  async generateExpressRoute(name, options = {}) {
    const routeName = name.toLowerCase();
    const routeTemplate = `const express = require('express');
const router = express.Router();
const ${name}Controller = require('../controllers/${name}Controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { ${routeName}Schema } = require('../schemas/${name}Schema');

// GET /${routeName}s - Get all ${routeName}s
router.get('/', auth, ${name}Controller.getAll);

// GET /${routeName}s/:id - Get ${routeName} by ID
router.get('/:id', auth, ${name}Controller.getById);

// POST /${routeName}s - Create new ${routeName}
router.post('/', 
  auth, 
  validate(${routeName}Schema.create), 
  ${name}Controller.create
);

// PUT /${routeName}s/:id - Update ${routeName}
router.put('/:id', 
  auth, 
  validate(${routeName}Schema.update), 
  ${name}Controller.update
);

// DELETE /${routeName}s/:id - Delete ${routeName}
router.delete('/:id', auth, ${name}Controller.delete);

module.exports = router;
`;

    const testTemplate = `const request = require('supertest');
const app = require('../../app');
const { setupTestDB, clearTestDB } = require('../helpers/testDB');

describe('${name} Routes', () => {
  beforeAll(async () => {
    await setupTestDB();
  });

  afterAll(async () => {
    await clearTestDB();
  });

  describe('GET /${routeName}s', () => {
    test('should return all ${routeName}s', async () => {
      const response = await request(app)
        .get('/${routeName}s')
        .expect(200);

      expect(response.body).toBeInstanceOf(Array);
    });

    test('should require authentication', async () => {
      await request(app)
        .get('/${routeName}s')
        .expect(401);
    });
  });

  describe('POST /${routeName}s', () => {
    test('should create new ${routeName}', async () => {
      const newItem = {
        name: 'Test ${name}',
        description: 'Test description'
      };

      const response = await request(app)
        .post('/${routeName}s')
        .send(newItem)
        .expect(201);

      expect(response.body.name).toBe(newItem.name);
      expect(response.body.id).toBeDefined();
    });

    test('should validate required fields', async () => {
      const invalidItem = {
        description: 'Missing name field'
      };

      await request(app)
        .post('/${routeName}s')
        .send(invalidItem)
        .expect(400);
    });
  });

  describe('PUT /${routeName}s/:id', () => {
    test('should update existing ${routeName}', async () => {
      const updates = {
        name: 'Updated ${name}',
        description: 'Updated description'
      };

      const response = await request(app)
        .put('/${routeName}s/1')
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe(updates.name);
    });

    test('should return 404 for non-existent ${routeName}', async () => {
      await request(app)
        .put('/${routeName}s/999')
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /${routeName}s/:id', () => {
    test('should delete ${routeName}', async () => {
      await request(app)
        .delete('/${routeName}s/1')
        .expect(204);
    });

    test('should return 404 for non-existent ${routeName}', async () => {
      await request(app)
        .delete('/${routeName}s/999')
        .expect(404);
    });
  });
});
`;

    await fs.ensureDir('src/routes');
    await fs.ensureDir('tests/routes');
    await fs.writeFile(`src/routes/${routeName}Routes.js`, routeTemplate);
    await fs.writeFile(`tests/routes/${routeName}Routes.test.js`, testTemplate);

    return {
      route: `src/routes/${routeName}Routes.js`,
      test: `tests/routes/${routeName}Routes.test.js`
    };
  },

  /**
   * Generate Express middleware
   * @param {string} name - Middleware name
   * @param {Object} options - Generation options
   */
  async generateExpressMiddleware(name, options = {}) {
    const middlewareTemplate = `/**
 * ${name} middleware
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Next middleware function
 */
const ${name.toLowerCase()} = (req, res, next) => {
  try {
    // Add your middleware logic here
    console.log('${name} middleware executed');
    
    // Example: Add timestamp to request
    req.timestamp = new Date().toISOString();
    
    // Example: Log request details
    console.log(\`\${req.method} \${req.path} - \${req.timestamp}\`);
    
    // Call next middleware
    next();
  } catch (error) {
    console.error('${name} middleware error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};

module.exports = ${name.toLowerCase()};
`;

    const testTemplate = `const ${name.toLowerCase()} = require('../src/middleware/${name.toLowerCase()}');

describe('${name} Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      method: 'GET',
      path: '/test',
      body: {},
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should call next middleware', () => {
    ${name.toLowerCase()}(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should add timestamp to request', () => {
    ${name.toLowerCase()}(req, res, next);
    expect(req.timestamp).toBeDefined();
    expect(typeof req.timestamp).toBe('string');
  });

  test('should handle errors gracefully', () => {
    const errorReq = {
      ...req,
      get method() {
        throw new Error('Test error');
      }
    };

    ${name.toLowerCase()}(errorReq, res, next);
    
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Internal server error',
      message: 'Test error'
    });
  });
});
`;

    await fs.ensureDir('src/middleware');
    await fs.ensureDir('tests/middleware');
    await fs.writeFile(`src/middleware/${name.toLowerCase()}.js`, middlewareTemplate);
    await fs.writeFile(`tests/middleware/${name.toLowerCase()}.test.js`, testTemplate);

    return {
      middleware: `src/middleware/${name.toLowerCase()}.js`,
      test: `tests/middleware/${name.toLowerCase()}.test.js`
    };
  },

  /**
   * Generate Express controller
   * @param {string} name - Controller name
   * @param {Object} options - Generation options
   */
  async generateExpressController(name, options = {}) {
    const controllerTemplate = `const ${name}Service = require('../services/${name}Service');
const { validationResult } = require('express-validator');

class ${name}Controller {
  /**
   * Get all ${name.toLowerCase()}s
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const result = await ${name}Service.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });

      res.json(result);
    } catch (error) {
      console.error('Get all ${name.toLowerCase()}s error:', error);
      res.status(500).json({
        error: 'Failed to fetch ${name.toLowerCase()}s',
        message: error.message
      });
    }
  }

  /**
   * Get ${name.toLowerCase()} by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const ${name.toLowerCase()} = await ${name}Service.getById(id);

      if (!${name.toLowerCase()}) {
        return res.status(404).json({
          error: '${name} not found'
        });
      }

      res.json(${name.toLowerCase()});
    } catch (error) {
      console.error('Get ${name.toLowerCase()} by ID error:', error);
      res.status(500).json({
        error: 'Failed to fetch ${name.toLowerCase()}',
        message: error.message
      });
    }
  }

  /**
   * Create new ${name.toLowerCase()}
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const ${name.toLowerCase()} = await ${name}Service.create(req.body);
      res.status(201).json(${name.toLowerCase()});
    } catch (error) {
      console.error('Create ${name.toLowerCase()} error:', error);
      res.status(500).json({
        error: 'Failed to create ${name.toLowerCase()}',
        message: error.message
      });
    }
  }

  /**
   * Update ${name.toLowerCase()}
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async update(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation failed',
          details: errors.array()
        });
      }

      const { id } = req.params;
      const ${name.toLowerCase()} = await ${name}Service.update(id, req.body);

      if (!${name.toLowerCase()}) {
        return res.status(404).json({
          error: '${name} not found'
        });
      }

      res.json(${name.toLowerCase()});
    } catch (error) {
      console.error('Update ${name.toLowerCase()} error:', error);
      res.status(500).json({
        error: 'Failed to update ${name.toLowerCase()}',
        message: error.message
      });
    }
  }

  /**
   * Delete ${name.toLowerCase()}
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await ${name}Service.delete(id);

      if (!deleted) {
        return res.status(404).json({
          error: '${name} not found'
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete ${name.toLowerCase()} error:', error);
      res.status(500).json({
        error: 'Failed to delete ${name.toLowerCase()}',
        message: error.message
      });
    }
  }
}

module.exports = new ${name}Controller();
`;

    await fs.ensureDir('src/controllers');
    await fs.writeFile(`src/controllers/${name}Controller.js`, controllerTemplate);

    return {
      controller: `src/controllers/${name}Controller.js`
    };
  },

  /**
   * Generate Express service
   * @param {string} name - Service name
   * @param {Object} options - Generation options
   */
     async generateExpressService(name, options = {}) {
     const serviceTemplate = `const ${name}Model = require('../models/${name}Model');
const { Op } = require('sequelize');

class ${name}Service {
  /**
   * Get all ${name.toLowerCase()}s with pagination
   * @param {Object} options - Query options
   * @returns {Promise<Object>} - Paginated results
   */
  async getAll(options = {}) {
    const { page = 1, limit = 10, search = '' } = options;
    const offset = (page - 1) * limit;

    const result = await ${name}Model.findAndCountAll({
      where: search ? {
        name: { [Op.iLike]: \`%\${search}%\` }
      } : {},
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    return {
      data: result.rows,
      total: result.count,
      page,
      limit,
      totalPages: Math.ceil(result.count / limit)
    };
  }

  /**
   * Get ${name.toLowerCase()} by ID
   * @param {string} id - ${name} ID
   * @returns {Promise<Object|null>} - ${name} object or null
   */
  async getById(id) {
    return await ${name}Model.findByPk(id);
  }

  /**
   * Create new ${name.toLowerCase()}
   * @param {Object} data - ${name} data
   * @returns {Promise<Object>} - Created ${name.toLowerCase()}
   */
  async create(data) {
    return await ${name}Model.create(data);
  }

  /**
   * Update ${name.toLowerCase()}
   * @param {string} id - ${name} ID
   * @param {Object} updates - Update data
   * @returns {Promise<Object|null>} - Updated ${name.toLowerCase()} or null
   */
  async update(id, updates) {
    const [updatedRowsCount] = await ${name}Model.update(updates, {
      where: { id }
    });

    if (updatedRowsCount === 0) {
      return null;
    }

    return await this.getById(id);
  }

  /**
   * Delete ${name.toLowerCase()}
   * @param {string} id - ${name} ID
   * @returns {Promise<boolean>} - True if deleted, false if not found
   */
  async delete(id) {
    const deletedRowsCount = await ${name}Model.destroy({
      where: { id }
    });

    return deletedRowsCount > 0;
  }

  /**
   * Search ${name.toLowerCase()}s
   * @param {string} query - Search query
   * @param {Object} options - Search options
   * @returns {Promise<Array>} - Search results
   */
  async search(query, options = {}) {
    const { limit = 10 } = options;

    return await ${name}Model.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.iLike]: \`%\${query}%\` } },
          { description: { [Op.iLike]: \`%\${query}%\` } }
        ]
      },
      limit,
      order: [['createdAt', 'DESC']]
    });
  }
}

module.exports = new ${name}Service();
`;

    await fs.ensureDir('src/services');
    await fs.writeFile(`src/services/${name}Service.js`, serviceTemplate);

    return {
      service: `src/services/${name}Service.js`
    };
  },

  /**
   * Generate Express model
   * @param {string} name - Model name
   * @param {Object} options - Generation options
   */
  async generateExpressModel(name, options = {}) {
    const modelTemplate = `const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ${name} = sequelize.define('${name}', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'pending'),
    defaultValue: 'active'
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: '${name.toLowerCase()}s',
  timestamps: true,
  paranoid: true, // Enable soft deletes
  hooks: {
    beforeCreate: (${name.toLowerCase()}, options) => {
      // Add any pre-creation logic here
      console.log(\`Creating ${name.toLowerCase()}: \${${name.toLowerCase()}.name}\`);
    },
    beforeUpdate: (${name.toLowerCase()}, options) => {
      // Add any pre-update logic here
      console.log(\`Updating ${name.toLowerCase()}: \${${name.toLowerCase()}.name}\`);
    }
  }
});

// Instance methods
${name}.prototype.toJSON = function() {
  const values = Object.assign({}, this.get());
  delete values.deletedAt; // Hide soft delete timestamp
  return values;
};

${name}.prototype.isActive = function() {
  return this.status === 'active';
};

// Class methods
${name}.getActiveCount = async function() {
  return await this.count({
    where: { status: 'active' }
  });
};

${name}.findByStatus = async function(status) {
  return await this.findAll({
    where: { status }
  });
};

module.exports = ${name};
`;

    await fs.ensureDir('src/models');
    await fs.writeFile(`src/models/${name}Model.js`, modelTemplate);

    return {
      model: `src/models/${name}Model.js`
    };
  },

  /**
   * Before generate hook
   * @param {Object} data - Generation data
   * @returns {Object} - Modified data
   */
  beforeGenerate(data) {
    console.log('🔄 Express plugin: Before generate hook called');
    return data;
  },

  /**
   * After generate hook
   * @param {Object} data - Generation data
   * @returns {Object} - Modified data
   */
  afterGenerate(data) {
    console.log('✅ Express plugin: After generate hook called');
    return data;
  },

  /**
   * Cleanup function
   */
  cleanup() {
    console.log('🧹 Express plugin cleanup');
  }
};

module.exports = ExpressPlugin;