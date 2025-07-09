const UserService = require('../services/UserService');
const { validationResult } = require('express-validator');

class UserController {
  /**
   * Get all users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getAll(req, res) {
    try {
      const { page = 1, limit = 10, search = '' } = req.query;
      const result = await UserService.getAll({
        page: parseInt(page),
        limit: parseInt(limit),
        search
      });

      res.json(result);
    } catch (error) {
      console.error('Get all users error:', error);
      res.status(500).json({
        error: 'Failed to fetch users',
        message: error.message
      });
    }
  }

  /**
   * Get user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await UserService.getById(id);

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json(user);
    } catch (error) {
      console.error('Get user by ID error:', error);
      res.status(500).json({
        error: 'Failed to fetch user',
        message: error.message
      });
    }
  }

  /**
   * Create new user
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

      const user = await UserService.create(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error('Create user error:', error);
      res.status(500).json({
        error: 'Failed to create user',
        message: error.message
      });
    }
  }

  /**
   * Update user
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
      const user = await UserService.update(id, req.body);

      if (!user) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.json(user);
    } catch (error) {
      console.error('Update user error:', error);
      res.status(500).json({
        error: 'Failed to update user',
        message: error.message
      });
    }
  }

  /**
   * Delete user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await UserService.delete(id);

      if (!deleted) {
        return res.status(404).json({
          error: 'User not found'
        });
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete user error:', error);
      res.status(500).json({
        error: 'Failed to delete user',
        message: error.message
      });
    }
  }
}

module.exports = new UserController();
