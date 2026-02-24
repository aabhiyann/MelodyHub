import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { AnalyticsController } from "../controllers/analytics.controller.js";

const router = Router();

// Generic event tracking (public/anonymous allowed but can capture userId if present)
router.post("/track-event", async (req, res) => {
  try {
    const { event, properties } = req.body;
    console.log(`[Analytics] Event: ${event}`, properties);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to track event" });
  }
});

// Web Vitals endpoint (Public API)
router.post("/web-vitals", async (req, res) => {
  try {
    let body = req.body;
    if (typeof body === 'string' && body.length > 0) {
      try { body = JSON.parse(body); } catch (e) { }
    }
    const { name, value, rating } = body;
    console.log(`[Web Vitals] ${name}: ${value} (${rating})`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save metrics" });
  }
});

router.post("/performance", async (req, res) => {
  try {
    const { metric, gridId, duration } = req.body;
    console.log(`[Performance] ${metric} - Grid: ${gridId}, Duration: ${duration}ms`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save metrics" });
  }
});

router.post("/experiment-exposure", async (req, res) => {
  try {
    const { experimentId, variant, userId } = req.body;
    console.log(`[Experiments] ${experimentId}: ${variant} (User: ${userId})`);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to track exposure" });
  }
});

// All following analytics routes require authentication
router.use(protectRoute);

// Analytics endpoints for tracking user behavior
router.post("/track-play", AnalyticsController.trackPlay);
router.post("/like-song", AnalyticsController.likeSong);
router.get("/user-preferences", AnalyticsController.getUserPreferences);

// Dashboard and insights (protected)
router.get("/dashboard", AnalyticsController.getDashboard);
router.get("/listening-history", AnalyticsController.getListeningHistory);
router.get("/top-artists", AnalyticsController.getTopArtists);
router.get("/top-genres", AnalyticsController.getTopGenres);
router.get("/listening-patterns", AnalyticsController.getListeningPatterns);

export default router;
