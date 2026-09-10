#include "FrequencyCounter.h"
#include<fstream>
#include<iostream>

Frequency FrequencyCounter::calculateFreq(const std::string &filePath)
{
    std::ifstream file(filePath, std::ios::binary);
    if(!file)
    {
        std::cerr<<"FILE COULD NOT BE OPENED {frequencyCounter}";
        return {};
    }
    Frequency result{};
    char byte;
    while(file.read(&byte, 1))
    {
        unsigned char index = static_cast<unsigned char>(byte);
        if(result.freq[index]==0) result.uniqueBytes++;
        result.freq[index]++;
    }
    return result;
}