# Skeleton-based Hazardous Action Recognition for Sports/Training Venues

Overview

In indoor sports halls and training venues, participants may perform hazardous actions—such as climbing, fence crossing, falling, and abnormal gait—that could lead to injuries if not detected promptly. This project builds a real-time skeleton-based action recognition and alerting system that extracts human keypoints from video, classifies hazardous actions, and issues alerts via APIs and event streams. The goal is to improve safety management with low latency and practical deployability.

Problem Setting & Objectives

Application scenario: sports halls and training grounds.
Target actions: climbing, fence crossing, falling, abnormal gait, and prolonged inactivity (static anomaly).
Core objectives:

Input: human skeleton keypoint sequences; output: action class per person.

Real-time inference: ≥15 FPS, end-to-end latency ≤500 ms.

Provide API services and event streams for easy system integration.
Technical Approach
2.1 Pose Estimation (Keypoint Extraction)

Model: RTMPose for fast, deployment-friendly 2D keypoints.

System design:

On-prem real-time inference at the venue;

Web/API mode to invoke local inference or a cloud endpoint (configurable).

Output tensor: N persons × T frames × K keypoints × 2 (x,y) plus visibility/confidence.

Default is 2D (RTMPose). 3D is optional future work.

Note: For multi-person tracking and ByteTrack association, person bounding boxes are required. Use RTMPose’s integrated detector or a lightweight pre-detector (e.g., YOLOv8) when needed.

2.2 Skeleton Sequence Modeling (Action Recognition)

Backbones: ST-GCN and ST-Transformer.

Training:

Pre-train / warm-start on NTU RGB+D 120 (skeleton modality);

Fine-tune on small, venue-specific data (transfer learning).

Fusion strategy: late fusion (e.g., weighted average of per-class probabilities) to combine ST-GCN and ST-Transformer.

Output: per-class probabilities and confidence per person.

2.3 Temporal Post-processing

Temporal smoothing: sliding window with causal smoothing + TPA (Temporal Probability Aggregation) to reduce jitter.

ID consistency: ByteTrack for multi-person association across frames (maintain stable person IDs).
2.4 APIs & Event System

Serving: FastAPI with WebSocket for streaming input/feedback; optional REST endpoints for batch jobs.

Functionality:

Upload video frames/streams or pre-extracted keypoints → return action labels + confidence + alert flags.

Event bus (e.g., Kafka/MQTT) publishes alerts to a dashboard and stores keyframe snapshots for human review.

Data & Protocols
3.1 Data Sources

Public datasets for pretraining/baselines: NTU RGB+D 120 (primary), optionally Kinetics-Skeleton for comparison.

Venue data for fine-tuning/evaluation: videos collected in target sports halls/training grounds (with consent and privacy protection).

3.2 Annotation Schema

Classes: climbing, fence crossing, falling, abnormal gait, prolonged inactivity (static anomaly).

Include “normal” classes (e.g., standing/walking) to improve discriminability and false-positive control.

3.3 Evaluation Protocols

Cross-Subject: train/test split by different participants to assess generalization across people.

Cross-Scene: evaluate under different venues, lighting, clothing to test robustness and domain shift.

Online real-time evaluation: measure latency, throughput (FPS), and runtime stability.
Metrics & Targets (for completeness)

Top-1 accuracy / macro-F1 on hazardous classes.

Latency: end-to-end ≤ 500 ms (camera → alert).

Throughput: ≥ 15 FPS per video stream on target hardware.

Stability: continuous run ≥ 1 hour without crash; low alert jitter after smoothing.

Deployment Notes

Hardware: GPU preferred for multi-person scenes; CPU fallback with reduced frame rate.

Privacy: store keyframes only on alerts; consider face blurring; retain skeletons rather than raw video when possible.

Safety: authentication for APIs, rate limiting, and audit logs; configurable alert thresholds.
