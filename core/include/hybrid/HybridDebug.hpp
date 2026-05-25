#pragma once
#define HYBRIDDEBUG_VERSION 1.3

#include <vector>
#include <cmath>
#include "raylib.h"

// Core debugging structures
struct DebugFrame {
    const char* function;
    const char* file;
    int line;
};

struct ParticleConfig {
    static float density;  // 0.0–1.0
    static float butter;   // shader uniform
};

namespace VisualDebug {
    void init() noexcept;          // Initialize Raylib resources
    void beginFrame() noexcept;    // Reset telemetry
    void renderHUD() noexcept;     // Draw pastry HUD

    void setParticleDensity(float density) noexcept;
    void updateShaderUniforms() noexcept;
}

namespace MetricSystem {
    struct FrameAnalysis {
        std::vector<DebugFrame> callstack;
        float recursionCost = 0.0f;
        bool timelineEvent = false;
    };

    FrameAnalysis captureMetrics() noexcept;
    void logAnalysis(const FrameAnalysis& results) noexcept;
}

namespace CrashHandler {
    void monitorCrashes() noexcept;
    void enableLiveLogging() noexcept;
}

// Integration helper
inline void debugFrameUpdate() {
    VisualDebug::beginFrame();
    auto analysis = MetricSystem::captureMetrics();

    if (analysis.timelineEvent) {
        MetricSystem::logAnalysis(analysis);
    }

    VisualDebug::renderHUD();
    CrashHandler::monitorCrashes();
}
