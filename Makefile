# ================================
# Hybrid Debug System — Termux Makefile
# ================================

CXX      := clang++
CXXFLAGS := -std=c++20 -O2 -Wall -Wextra

# Raylib + X11 libs (Termux layout)
LIBS := -lraylib -lGL -lm -lpthread -ldl -lrt -lX11

# Source files
SRC := main.cpp HybridDebug.cpp
OUT := debug_demo

# Default build target
all: $(OUT)

$(OUT): $(SRC)
	$(CXX) $(CXXFLAGS) $(SRC) -o $(OUT) $(LIBS)

# Clean build artifacts
clean:
	rm -f $(OUT)

# Run (requires X11 display server)
run: $(OUT)
	./$(OUT)
