#pragma once

#include<cstdint>
#include<string>

struct Frequency
{
    uint64_t freq[256];
    int uniqueBytes;
};

class FrequencyCounter
{
    public: Frequency calculateFreq(const std::string &filePath);
};