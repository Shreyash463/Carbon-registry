import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { registryStore } from './src/utils/registryStore.ts';
import { verifyLedgerChain } from './src/utils/cryptoLedger.ts';
import { generateAIMRVSummary } from './src/server/aiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // Ensure registry store is initialized
  await registryStore.initialize();

  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // ----------------------------------------------------
  // API Endpoints
  // ----------------------------------------------------

  // 1. Get all mangrove sites
  app.get('/api/sites', (req: Request, res: Response) => {
    try {
      const sites = registryStore.getSites();
      res.json({ success: true, sites });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 2. Get single site
  app.get('/api/sites/:id', (req: Request, res: Response) => {
    try {
      const site = registryStore.getSiteById(req.params.id);
      if (!site) {
        return res.status(404).json({ success: false, error: 'Site not found' });
      }
      res.json({ success: true, site });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 3. Get entire blockchain ledger
  app.get('/api/ledger', (req: Request, res: Response) => {
    try {
      const ledger = registryStore.getLedger();
      res.json({ success: true, ledger });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 4. Verify blockchain ledger integrity (computes SHA-256 and Merkle proofs)
  app.get('/api/ledger/verify', async (req: Request, res: Response) => {
    try {
      const ledger = registryStore.getLedger();
      const verification = await verifyLedgerChain(ledger);
      res.json({ success: true, verification });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 5. Tamper with a block (live demo feature)
  app.post('/api/ledger/tamper', (req: Request, res: Response) => {
    try {
      const { blockIndex = 1, fakeCreditsCount = 999999 } = req.body;
      const result = registryStore.tamperWithBlock(Number(blockIndex), Number(fakeCreditsCount));
      res.json({ success: true, message: `Block #${blockIndex} maliciously modified for demo.`, result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // 6. Reset / repair blockchain ledger
  app.post('/api/ledger/repair', async (req: Request, res: Response) => {
    try {
      await registryStore.resetRegistry();
      res.json({ success: true, message: 'Registry ledger re-anchored and verified to canonical state.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 7. Get carbon credits
  app.get('/api/credits', (req: Request, res: Response) => {
    try {
      const status = req.query.status as any;
      const credits = registryStore.getCredits(status);
      res.json({ success: true, credits, count: credits.length });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 8. Get registry stats
  app.get('/api/stats', (req: Request, res: Response) => {
    try {
      const stats = registryStore.getStats();
      res.json({ success: true, stats });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // 9. Run MRV Verification and Mint Credits
  app.post('/api/mrv/verify', async (req: Request, res: Response) => {
    try {
      const { siteId, bufferRatioPct = 20 } = req.body;
      if (!siteId) {
        return res.status(400).json({ success: false, error: 'siteId is required' });
      }

      const site = registryStore.getSiteById(siteId);
      if (!site) {
        return res.status(404).json({ success: false, error: 'Site not found' });
      }

      // First run local consensus check
      const { runMRVConsensusCheck } = await import('./src/utils/mrvEngine.ts');
      const consensus = runMRVConsensusCheck(site, bufferRatioPct);

      // Generate AI summary via Gemini with fallback
      const aiResult = await generateAIMRVSummary(site, consensus);

      // Mint credits onto the blockchain ledger
      const result = await registryStore.runVerificationAndMint(siteId, bufferRatioPct, aiResult.summary);

      res.json({
        success: true,
        message: `Successfully verified and minted ${result.consensus.reconciledAnnualSequestrationTCO2e.toLocaleString()} credits for ${site.name}`,
        ...result,
        isAiGenerated: aiResult.isAiGenerated
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // 10. Simulate Ecological Degradation (triggers automated Buffer Reserve Burn)
  app.post('/api/mrv/simulate-degradation', async (req: Request, res: Response) => {
    try {
      const { siteId, severity = 'SEVERE_CYCLONE' } = req.body;
      if (!siteId) {
        return res.status(400).json({ success: false, error: 'siteId is required' });
      }

      const result = await registryStore.triggerReversalDegradation(siteId, severity);
      res.json({
        success: true,
        message: `Reversal event triggered: ${result.burnedReserveCredits.toLocaleString()} buffer reserve credits burned to compensate for ${result.biomassLossTCO2e.toLocaleString()} tCO2e loss.`,
        ...result
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // 11. Permanently retire a tradeable carbon credit
  app.post('/api/credits/retire', async (req: Request, res: Response) => {
    try {
      const { creditId, beneficiary, reason } = req.body;
      if (!creditId || !beneficiary || !reason) {
        return res.status(400).json({ 
          success: false, 
          error: 'creditId, beneficiary, and reason are required' 
        });
      }

      const result = await registryStore.retireCredit(creditId, beneficiary, reason);
      res.json({
        success: true,
        message: `Credit ${creditId} permanently retired on behalf of ${beneficiary}.`,
        ...result
      });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  });

  // 12. Full registry reset
  app.post('/api/reset', async (req: Request, res: Response) => {
    try {
      await registryStore.resetRegistry();
      res.json({ success: true, message: 'Registry reset to initial clean state.' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // ----------------------------------------------------
  // Vite / Static Files Middleware
  // ----------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 Blue Carbon Registry Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Blue Carbon Registry server:', err);
  process.exit(1);
});
