// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface ITwoFactorAuth {
    function registerUser(string calldata username, bytes calldata publicKey, bytes32 otpSeed) external;
    function generateOTP() external view returns (uint256);
    function authenticateUser(bytes calldata publicKey, uint256 otp) external returns (bool);
    function isOTPValid(bytes calldata publicKey, uint256 otp) external view returns (bool);
    function getUserDetails(address user) external view returns (string memory, bytes memory, bytes32);
}

contract TwoFactorAuth is ITwoFactorAuth {
    struct User {
        string username;
        bytes publicKey;       
        bytes32 otpSeed;
        uint256 lastOtpTimestamp;
    }

    mapping(address => User) private users;
    mapping(address => uint256) private otpHistory;

    event UserRegistered(address indexed user, string username);
    event OtpGenerated(address indexed user, uint256 otp);
    event UserAuthenticated(address indexed user, bool success);

    function registerUser(string calldata _username, bytes calldata _publicKey, bytes32 _otpSeed) external override {
        require(users[msg.sender].publicKey.length == 0, "User already registered");
        require(_publicKey.length == 65, "Public key must be 65 bytes");
        
        users[msg.sender] = User({
            username: _username,
            publicKey: _publicKey,
            otpSeed: _otpSeed,
            lastOtpTimestamp: 0
        });

        emit UserRegistered(msg.sender, _username);
    }

    // Generate OTP for the caller user
    function generateOTP() external view override returns (uint256) {
        require(users[msg.sender].publicKey.length == 65, "User not registered");
        uint256 currentTime = block.timestamp / 30; // 30-second time window

        // OTP derived from otpSeed + current time window
        uint256 otp = uint256(keccak256(abi.encodePacked(users[msg.sender].otpSeed, currentTime))) % 1000000; // 6-digit OTP

        return otp;
    }

    // Authenticate user by public key and OTP
    function authenticateUser(bytes calldata _publicKey, uint256 _otp) external override returns (bool) {
    User storage user = users[msg.sender];
    require(user.publicKey.length == 65, "User not registered");
    require(compareBytes(user.publicKey, _publicKey), "Public key mismatch");

    uint256 currentTime = block.timestamp / 30;

    // Check OTP for current and previous time window (allow 30s skew)
    uint256 expectedOtpCurrent = uint256(keccak256(abi.encodePacked(user.otpSeed, currentTime))) % 1000000;
    uint256 expectedOtpPrevious = uint256(keccak256(abi.encodePacked(user.otpSeed, currentTime - 1))) % 1000000;

    bool success = (_otp == expectedOtpCurrent || _otp == expectedOtpPrevious);

    emit UserAuthenticated(msg.sender, success);
    return success;
}


    // Check if an OTP is valid for given public key
    function isOTPValid(bytes calldata _publicKey, uint256 _otp) external view override returns (bool) {
        User storage user = users[msg.sender];
        if (user.publicKey.length != 65) return false;
        if (!compareBytes(user.publicKey, _publicKey)) return false;

        uint256 currentTime = block.timestamp / 30;
        uint256 expectedOtp = uint256(keccak256(abi.encodePacked(user.otpSeed, currentTime))) % 1000000;

        return (_otp == expectedOtp);
    }

    // Get user details by address
    function getUserDetails(address userAddress) external view override returns (string memory, bytes memory, bytes32) {
        User storage user = users[userAddress];
        return (user.username, user.publicKey, user.otpSeed);
    }

    // Helper function to compare two bytes arrays
    function compareBytes(bytes memory a, bytes memory b) internal pure returns (bool) {
        if (a.length != b.length) return false;
        for (uint256 i = 0; i < a.length; i++) {
            if (a[i] != b[i]) return false;
        }
        return true;
    }
}
