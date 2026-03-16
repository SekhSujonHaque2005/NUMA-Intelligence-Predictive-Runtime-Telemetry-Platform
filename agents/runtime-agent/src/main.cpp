#include <iostream>
#include <numa.h>

int main() {

    if (numa_available() == -1) {
        std::cout << "NUMA not supported. Running in single-node mode.\n";
        std::cout << "CPU analysis only.\n";
        return 0;
    }

    int nodes = numa_max_node() + 1;

    std::cout << "NUMA system detected\n";
    std::cout << "Total nodes: " << nodes << std::endl;

    return 0;
}