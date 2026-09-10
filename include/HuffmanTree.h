#pragma once

#include<cstdint>
#include "FrequencyCounter.h"
#include<array>
#include<string>

struct HuffmanNode
{
    unsigned char byte;
    uint64_t frequency;
    HuffmanNode *left;
    HuffmanNode *right;
};

class HuffmanTree
{
    public: 
        struct HuffmanNode* generateTree(const Frequency &freq);
        std::array<std::string, 256> generateCodes(struct HuffmanNode* root);

    private:
        void codeHelper(struct HuffmanNode* root, std::string currentCode, std::array<std::string, 256> &codes);
};

