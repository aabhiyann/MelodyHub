import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { AnalyticsController } from "../controllers/analytics.controller.js";

const router = Router();

// All analytics routes require authentication
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

// Generic event tracking
router.post("/track-event", protectRoute, async (req, res) => {
  try {
    const { event, properties } = req.body;

    // Log event (in production, save to database)
    console.log(`[Analytics] Event: ${event}`, properties);

    // TODO: Save to database when Analytics model is created
    // await Analytics.create({
    //   userId: req.auth?.userId,
    //   event,
    //   properties,
    //   timestamp: new Date()
    // });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Analytics] Error tracking event:", error);
    res.status(500).json({ error: "Failed to track event" });
  }
});

// Web Vitals endpoint
router.post("/web-vitals", async (req, res) => {
  try {
    const { name, value, rating, delta, id } = req.body;

    // Log metrics (in production, save to database)
    console.log(`[Web Vitals] ${name}: ${value} (${rating})`);

    // TODO: Save to database when WebVitals model is created
    // await WebVitals.create({
    //   userId: req.auth?.userId,
    //   metric: name,
    //   value,
    //   rating,
    //   delta,
    //   metricId: id,
    //   userAgent: req.headers['user-agent'],
    //   timestamp: new Date()
    // });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Web Vitals] Error saving metrics:", error);
    res.status(500).json({ error: "Failed to save metrics" });
  }
});

// Performance metrics endpoint
router.post("/performance", async (req, res) => {
  try {
    const { metric, gridId, duration } = req.body;

    // Log performance metrics (in production, save to database)
    console.log(`[Performance] ${metric} - Grid: ${gridId}, Duration: ${duration}ms`);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Performance] Error saving metrics:", error);
    res.status(500).json({ error: "Failed to save metrics" });
  }
});

// Experiment exposure tracking
router.post("/experiment-exposure", async (req, res) => {
  try {
    const { experimentId, variant, userId } = req.body;

    // Log experiment exposure (in production, save to database)
    console.log(`[Experiments] ${experimentId}: ${variant} (User: ${userId})`);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[Experiments] Error tracking exposure:", error);
    res.status(500).json({ error: "Failed to track exposure" });
  }
});

export default router;
