import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  trackPlay,
  likeSong,
  getUserPreferences,
  getDashboard,
  getListeningHistory,
  getTopArtists,
  getTopGenres,
  getListeningPatterns,
} from "../controllers/analytics.controller.js";

const router = Router();

// Analytics endpoints for tracking user behavior
router.post("/track-play", protectRoute, trackPlay);
router.post("/like-song", protectRoute, likeSong);
router.get("/user-preferences", getUserPreferences);

// Dashboard and insights (protected)
router.get("/dashboard", protectRoute, getDashboard);
router.get("/listening-history", protectRoute, getListeningHistory);
router.get("/top-artists", protectRoute, getTopArtists);
router.get("/top-genres", protectRoute, getTopGenres);
router.get("/listening-patterns", protectRoute, getListeningPatterns);

// Generic event tracking
router.post("/track-event", async (req, res) => {
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
