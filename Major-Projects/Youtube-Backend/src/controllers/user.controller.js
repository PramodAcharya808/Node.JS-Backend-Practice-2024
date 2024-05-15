const registerUser = (req, res) => {
  try {
    res.status(200).json({
      message: "OK",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
    console.log(err.message);
  }
};

export { registerUser };
