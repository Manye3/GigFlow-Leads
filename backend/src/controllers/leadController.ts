import { Request, Response } from 'express';
import Lead from '../models/Lead';

// @desc    Get all leads with pagination, filtering, and sorting
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { status, source, search, sort } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 }; // Default: Latest
    if (sort === 'oldest') {
      sortOption = { createdAt: 1 };
    }

    const leads = await Lead.find(query).sort(sortOption).skip(skip).limit(limit);
    const total = await Lead.countDocuments(query);

    res.json({
      leads,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (lead) {
      res.json(lead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, status, source } = req.body;

    const leadExists = await Lead.findOne({ email });
    if (leadExists) {
      res.status(400).json({ message: 'Lead with this email already exists' });
      return;
    }

    const lead = await Lead.create({
      name,
      email,
      status: status || 'New',
      source,
    });

    res.status(201).json(lead);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      lead.name = req.body.name || lead.name;
      lead.email = req.body.email || lead.email;
      lead.status = req.body.status || lead.status;
      lead.source = req.body.source || lead.source;

      const updatedLead = await lead.save();
      res.json(updatedLead);
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req: Request, res: Response): Promise<void> => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      await Lead.deleteOne({ _id: lead._id });
      res.json({ message: 'Lead removed' });
    } else {
      res.status(404).json({ message: 'Lead not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export leads to CSV
// @route   GET /api/leads/export/csv
// @access  Private
export const exportLeadsCSV = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, source, search, sort } = req.query;
    const query: any = {};

    if (status) query.status = status;
    if (source) query.source = source;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };

    // Fetch all matching leads without pagination
    const leads = await Lead.find(query).sort(sortOption);

    // Create CSV header
    let csv = 'ID,Name,Email,Status,Source,CreatedAt\n';

    // Populate rows
    leads.forEach((lead) => {
      csv += `${lead._id},${lead.name},${lead.email},${lead.status},${lead.source},${lead.createdAt.toISOString()}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('leads.csv');
    res.send(csv);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
